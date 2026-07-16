import json, sys, glob
from pathlib import Path
from datetime import datetime, timezone
from graphify.detect import detect_incremental, save_manifest
from graphify.extract import collect_files, extract
from graphify.cache import check_semantic_cache, save_semantic_cache
from graphify.build import build_from_json, build_merge
from graphify.cluster import cluster, score_all
from graphify.analyze import god_nodes, surprising_connections, suggest_questions, graph_diff
from graphify.report import generate
from graphify.export import to_json, to_html
from networkx.readwrite import json_graph
import networkx as nx

def main():
    detect = detect_incremental(Path('.'))
    new_total = detect.get('new_total', 0)
    deleted = list(detect.get('deleted_files', []))

    if new_total == 0 and not deleted:
        print('[graphify update] No files changed since last run. Nothing to update.')
        return

    if deleted:
        print(f'[graphify update] {len(deleted)} deleted file(s) to prune.')
    if new_total > 0:
        print(f'[graphify update] {new_total} new/changed file(s) to re-extract.')

    # --- Step 3A: AST extraction on changed code files ---
    ast_nodes, ast_edges = [], []
    code_files = detect.get('new_files', {}).get('code', [])
    if code_files:
        files = [Path(f) for f in code_files]
        result = extract(files, cache_root=Path('.'))
        ast_nodes = result.get('nodes', [])
        ast_edges = result.get('edges', [])
        print(f'[graphify update] AST: {len(ast_nodes)} nodes, {len(ast_edges)} edges')
    else:
        print('[graphify update] No code files to extract')

    # --- Step 3B: Semantic extraction on changed doc/image files ---
    doc_image_files = []
    for cat in ('document', 'paper', 'image'):
        doc_image_files.extend(detect.get('new_files', {}).get(cat, []))
    sem_nodes, sem_edges, sem_hyperedges = [], [], []

    if doc_image_files:
        cached_nodes, cached_edges, cached_hyperedges, uncached = check_semantic_cache(doc_image_files, root='.')
        print(f'[graphify update] Semantic cache: {len(doc_image_files)-len(uncached)} hit, {len(uncached)} need extraction')

        if cached_nodes or cached_edges or cached_hyperedges:
            sem_nodes = cached_nodes
            sem_edges = cached_edges
            sem_hyperedges = cached_hyperedges
            print(f'[graphify update] Cached: {len(cached_nodes)} nodes, {len(cached_edges)} edges')

        if uncached:
            print(f'[graphify update] {len(uncached)} uncached files need semantic extraction.')
            print('[graphify update] Set GEMINI_API_KEY or use the graphify CLI for semantic extraction.')
            print('[graphify update] For now, skipping uncached semantic files (graph will use AST only).')
    else:
        print('[graphify update] No doc/image files to extract')

    # --- Step 3C: Merge AST + semantic ---
    seen = {n['id'] for n in ast_nodes}
    merged_nodes = list(ast_nodes)
    for n in sem_nodes:
        if n['id'] not in seen:
            merged_nodes.append(n)
            seen.add(n['id'])
    merged = {
        'nodes': merged_nodes,
        'edges': ast_edges + sem_edges,
        'hyperedges': sem_hyperedges,
        'input_tokens': 0,
        'output_tokens': 0,
    }
    merged_edges_list = ast_edges + sem_edges
    print(f'[graphify update] Merged extraction: {len(merged_nodes)} nodes, {len(merged_edges_list)} edges')

    # --- Merge into existing graph ---
    old_path = Path('graphify-out/graph.json')
    if old_path.exists():
        Path('graphify-out/.graphify_old.json').write_bytes(old_path.read_bytes())

    prune = list(deleted) or None
    G = build_merge(
        [merged],
        graph_path='graphify-out/graph.json',
        prune_sources=prune,
        root='.',
        directed=False,
    )
    print(f'[graphify update] Merged: {G.number_of_nodes()} nodes, {G.number_of_edges()} edges')

    # Write merged extraction back for downstream
    merged_out = {
        'nodes': [{'id': n, **d} for n, d in G.nodes(data=True)],
        'edges': [
            {**{k: val for k, val in d.items() if k not in ('_src', '_tgt', 'source', 'target')},
             'source': d.get('_src', u), 'target': d.get('_tgt', v)}
            for u, v, d in G.edges(data=True)
        ],
        'hyperedges': list(G.graph.get('hyperedges', [])),
        'input_tokens': 0,
        'output_tokens': 0,
    }

    # --- Clustering, analysis, report ---
    communities = cluster(G)
    cohesion = score_all(G, communities)
    gods = god_nodes(G)
    surprises = surprising_connections(G, communities)
    labels = {}
    existing_labels = Path('graphify-out/.graphify_labels.json')
    if existing_labels.exists():
        labels = {int(k): v for k, v in json.loads(existing_labels.read_text(encoding='utf-8')).items()}
    else:
        labels = {cid: f'Community {cid}' for cid in communities}

    # Assign new community labels for any new ones
    for cid in communities:
        if cid not in labels:
            node_sample = [G.nodes[n].get('label', n) for n in list(communities[cid])[:3]]
            labels[cid] = f'Community {cid} ({", ".join(node_sample)})'

    questions = suggest_questions(G, communities, labels)
    tokens = {'input': 0, 'output': 0}

    # Build detection info for report
    detection_info = {
        'total_files': detect.get('new_total', 0),
        'total_words': detect.get('total_words', 0),
    }

    wrote = to_json(G, communities, 'graphify-out/graph.json')
    if not wrote:
        print('[graphify update] WARNING: refused to shrink graph.json (existing graph larger)')

    report = generate(G, communities, cohesion, labels, gods, surprises, detection_info, tokens, '.', suggested_questions=questions)
    Path('graphify-out/GRAPH_REPORT.md').write_text(report, encoding='utf-8')
    Path('graphify-out/.graphify_labels.json').write_text(json.dumps({str(k): v for k, v in labels.items()}, ensure_ascii=False), encoding='utf-8')
    print('[graphify update] Report regenerated')

    # --- HTML export ---
    label_dict = {int(k): v for k, v in json.loads(Path('graphify-out/.graphify_labels.json').read_text(encoding='utf-8')).items()}
    member_counts = {cid: len(nodes) for cid, nodes in communities.items()}
    to_html(G=G, communities=communities, output_path='graphify-out/graph.html',
            community_labels=label_dict, member_counts=member_counts)
    print('[graphify update] HTML exported')

    # --- Diff ---
    old_path_bak = Path('graphify-out/.graphify_old.json')
    if old_path_bak.exists():
        old_data = json.loads(old_path_bak.read_text(encoding='utf-8'))
        G_old = json_graph.node_link_graph(old_data, edges='links')
        diff = graph_diff(G_old, G)
        print(f'[graphify update] Diff: {diff["summary"]}')
        old_path_bak.unlink()

    # --- Save manifest for next update ---
    save_manifest(detect.get('all_files') or detect['files'], root='.')

    # --- Cost tracker ---
    cost_path = Path('graphify-out/cost.json')
    if cost_path.exists():
        cost = json.loads(cost_path.read_text(encoding='utf-8'))
    else:
        cost = {'runs': [], 'total_input_tokens': 0, 'total_output_tokens': 0}
    cost['runs'].append({
        'date': datetime.now(timezone.utc).isoformat(),
        'input_tokens': 0,
        'output_tokens': 0,
        'files': detect.get('new_total', 0),
    })
    cost_path.write_text(json.dumps(cost, indent=2, ensure_ascii=False), encoding='utf-8')

    print(f'[graphify update] Done — {G.number_of_nodes()} nodes, {G.number_of_edges()} edges, {len(communities)} communities')

if __name__ == '__main__':
    main()
