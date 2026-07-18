import json
from pathlib import Path
import sys
sys.path.insert(0, str(Path.home() / 'AppData/Local/Programs/Python/Python313/Lib/site-packages'))
from graphify.incremental import update
from graphify.cache import check_semantic_cache, save_semantic_cache
from graphify.extract import collect_files, extract
from graphify.build import build_from_json
from graphify.cluster import cluster, score_all
from graphify.analyze import god_nodes, surprising_connections, suggest_questions
from graphify.report import generate
from graphify.export import to_json

root = Path('.').resolve()
ast_result = extract(
    [f for f in root.rglob('*') if f.suffix in ('.ts','.tsx','.json','.yaml','.yml') and f.is_file() and 'node_modules' not in f.parts and 'dist' not in f.parts and 'graphify-out' not in f.parts and '.graphify' not in str(f)],
    cache_root=str(root)
)
print(f'AST: {len(ast_result["nodes"])} nodes, {len(ast_result["edges"])} edges')

extraction_path = Path('graphify-out/.graphify_extract.json')
if extraction_path.exists():
    extraction = json.loads(extraction_path.read_text(encoding='utf-8'))
else:
    extraction = {'nodes':[],'edges':[],'hyperedges':[],'input_tokens':0,'output_tokens':0}

existing_ids = {n['id'] for n in extraction['nodes']}
new_nodes = [n for n in ast_result['nodes'] if n['id'] not in existing_ids]
extraction['nodes'].extend(new_nodes)
extraction['edges'].extend(ast_result['edges'])

G = build_from_json(extraction, root=str(root), directed=False)
if G.number_of_nodes() == 0:
    print('ERROR: Graph is empty')
else:
    communities = cluster(G)
    cohesion = score_all(G, communities)
    gods = god_nodes(G)
    surprises = surprising_connections(G, communities)
    labels = {cid: 'Community ' + str(cid) for cid in communities}
    questions = suggest_questions(G, communities, labels)
    wrote = to_json(G, communities, 'graphify-out/graph.json')
    if wrote:
        print(f'Graph updated: {G.number_of_nodes()} nodes, {G.number_of_edges()} edges, {len(communities)} communities')
