import * as React from 'react';
import Editor from '@monaco-editor/react';
import type { Monaco } from '@monaco-editor/react';
import {
	Play,
	Save,
	Check,
	RefreshCw,
	AlertTriangle,
	FileCode,
	GitBranch,
} from 'lucide-react';
import { toast } from 'sonner';
import type { WorkflowNode, DbEdge, WorkflowDefinition } from '../types';
import {
	validateWorkflow,
	type ValidationResult,
} from '@flow-forge/shared-validation';
import { calculateLayout, type NodePosition } from '../utils/workflow-layout';
import { Button } from '~/components/ui/button';
import { cn } from '~/shared/utils/utils';
import { workflowSchema } from './workflow-editor-schema';

interface WorkflowEditorProps {
	initialDefinition?: WorkflowDefinition;
	onSave: (definition: WorkflowDefinition) => void;
	isSaving?: boolean;
	executionStatus?: Record<string, 'running' | 'success' | 'failed'>;
}

// 1. Color coding for node types
const NODE_COLORS = {
	HTTP_CALL: {
		border: '#2196F3',
		bg: '#e3f2fd',
		text: '#0d47a1',
	},
	DELAY: {
		border: '#FF9800',
		bg: '#fff3e0',
		text: '#e65100',
	},
	CONDITIONAL_BRANCH: {
		border: '#9C27B0',
		bg: '#f3e5f5',
		text: '#4a148c',
	},
	DATA_TRANSFORM: {
		border: '#4CAF50',
		bg: '#e8f5e9',
		text: '#1b5e20',
	},
};

// 2. Node type description map
const NODE_TYPE_LABELS: Record<string, string> = {
	HTTP_CALL: 'HTTP Call',
	DELAY: 'Delay Step',
	CONDITIONAL_BRANCH: 'Condition Branch',
	DATA_TRANSFORM: 'Data Transform',
};

// Sub-component: Legend
function NodeTypeLegend() {
	return (
		<div className="flex flex-wrap gap-4 px-4 py-2 bg-muted/20 border-b text-xs text-muted-foreground">
			<span className="font-semibold mr-1">Legend:</span>
			{Object.entries(NODE_COLORS).map(([type, colors]) => (
				<div key={type} className="flex items-center gap-1.5">
					<span
						className="w-3 h-3 rounded border"
						style={{ backgroundColor: colors.bg, borderColor: colors.border }}
					/>
					<span>{NODE_TYPE_LABELS[type]}</span>
				</div>
			))}
		</div>
	);
}

// Sub-component: Validation Panel
function ValidationPanel({
	errors,
	valid,
}: {
	errors: string[];
	valid: boolean;
}) {
	if (valid) {
		return (
			<div className="p-4 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-800 flex items-start gap-2.5">
				<Check className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
				<div>
					<h4 className="font-semibold text-sm">Workflow is Valid</h4>
					<p className="text-xs text-emerald-700 mt-0.5">
						All structural validations, required fields, and DAG cycle checks
						passed successfully.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md text-destructive flex items-start gap-2.5">
			<AlertTriangle className="h-5 w-5 shrink-0 text-destructive mt-0.5" />
			<div>
				<h4 className="font-semibold text-sm">
					Validation Errors ({errors.length})
				</h4>
				<ul className="list-disc pl-5 mt-1 space-y-0.5 text-xs text-destructive/90">
					{errors.map((err, i) => (
						<li key={i}>{err}</li>
					))}
				</ul>
			</div>
		</div>
	);
}

// Sub-component: SVG Visualization Renderer
interface WorkflowVisualizationProps {
	nodes: WorkflowNode[];
	edges: DbEdge[];
	positions: NodePosition[];
	executionStatus?: Record<string, 'running' | 'success' | 'failed'>;
}

function WorkflowVisualization({
	nodes,
	edges,
	positions,
	executionStatus,
}: WorkflowVisualizationProps) {
	const nodeWidth = 180;
	const nodeHeight = 64;

	const getPosition = (id: string) => {
		return positions.find((p) => p.id === id) || { x: 50, y: 50 };
	};

	// Determine bounding box for SVG canvas sizing
	const { width, height } = React.useMemo(() => {
		if (positions.length === 0) return { width: 800, height: 400 };
		let maxX = 0;
		let maxY = 0;
		positions.forEach((pos) => {
			if (pos.x + nodeWidth > maxX) maxX = pos.x + nodeWidth;
			if (pos.y + nodeHeight > maxY) maxY = pos.y + nodeHeight;
		});
		return {
			width: Math.max(800, maxX + 100),
			height: Math.max(500, maxY + 100),
		};
	}, [positions]);

	return (
		<div className="w-full h-full min-h-87.5 overflow-auto bg-slate-50 border rounded-md relative select-none">
			{nodes.length === 0 ? (
				<div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
					<GitBranch className="h-10 w-10 text-muted-foreground/50 mb-2" />
					<p className="text-sm">No nodes to visualize.</p>
					<p className="text-xs text-muted-foreground/70 mt-1">
						Add nodes in the JSON definition to view the visualization.
					</p>
				</div>
			) : (
				<svg
					width={width}
					height={height}
					className="font-sans"
					style={{ minWidth: '100%', minHeight: '100%' }}
				>
					<defs>
						{/* Standard slate arrowhead */}
						<marker
							id="arrow-default"
							viewBox="0 0 10 10"
							refX="6"
							refY="5"
							markerWidth="6"
							markerHeight="6"
							orient="auto-start-reverse"
						>
							<path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#64748b" />
						</marker>
						{/* Green arrowhead for True branch */}
						<marker
							id="arrow-true"
							viewBox="0 0 10 10"
							refX="6"
							refY="5"
							markerWidth="6"
							markerHeight="6"
							orient="auto-start-reverse"
						>
							<path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#10b981" />
						</marker>
						{/* Red arrowhead for False branch */}
						<marker
							id="arrow-false"
							viewBox="0 0 10 10"
							refX="6"
							refY="5"
							markerWidth="6"
							markerHeight="6"
							orient="auto-start-reverse"
						>
							<path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#ef4444" />
						</marker>
					</defs>

					{/* Render Connections/Edges */}
					{edges.map((edge, idx) => {
						const start = getPosition(edge.from);
						const end = getPosition(edge.to);

						// Connect from middle-right of source node to middle-left of target node
						const startX = start.x + nodeWidth;
						const startY = start.y + nodeHeight / 2;
						const endX = end.x;
						const endY = end.y + nodeHeight / 2;

						// Draw a smooth bezier curve
						const controlPointOffset = Math.max(
							50,
							Math.abs(endX - startX) * 0.4,
						);
						const cp1x = startX + controlPointOffset;
						const cp1y = startY;
						const cp2x = endX - controlPointOffset;
						const cp2y = endY;

						const pathData = `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;

						// Handle labels and markers for conditional branches
						let edgeColor = '#64748b';
						let markerId = 'arrow-default';
						let edgeLabel = '';

						if (edge.sourceHandle === 'true') {
							edgeColor = '#10b981'; // green
							markerId = 'arrow-true';
							edgeLabel = 'True';
						} else if (edge.sourceHandle === 'false') {
							edgeColor = '#ef4444'; // red
							markerId = 'arrow-false';
							edgeLabel = 'False';
						}

						return (
							<g key={`edge-${idx}`}>
								<path
									d={pathData}
									fill="none"
									stroke={edgeColor}
									strokeWidth="2"
									markerEnd={`url(#${markerId})`}
									className="transition-all duration-300"
								/>
								{edgeLabel && (
									<g transform={`translate(${startX + 18}, ${startY - 4})`}>
										<rect
											x="-14"
											y="-10"
											width="28"
											height="14"
											fill="#f8fafc"
											rx="3"
											stroke={edgeColor}
											strokeWidth="1"
										/>
										<text
											fontSize="9"
											fontWeight="bold"
											fill={edgeColor}
											textAnchor="middle"
											dominantBaseline="middle"
											y="-3"
										>
											{edgeLabel}
										</text>
									</g>
								)}
							</g>
						);
					})}

					{/* Render Nodes */}
					{nodes.map((node) => {
						const pos = getPosition(node.id);
						const typeColor = NODE_COLORS[node.type] || {
							border: '#94a3b8',
							bg: '#f1f5f9',
							text: '#334155',
						};

						const label = node.data?.label || node.id;
						const status = executionStatus?.[node.id];

						let borderStroke = typeColor.border;
						let strokeWidth = '2';
						let strokeDasharray: string | undefined = undefined;

						if (status === 'running') {
							borderStroke = '#f59e0b'; // amber-500
							strokeWidth = '3';
							strokeDasharray = '4 4';
						} else if (status === 'success') {
							borderStroke = '#10b981'; // emerald-500
							strokeWidth = '3';
						} else if (status === 'failed') {
							borderStroke = '#ef4444'; // rose-500
							strokeWidth = '3';
						}

						return (
							<g key={node.id} transform={`translate(${pos.x}, ${pos.y})`}>
								<rect
									width={nodeWidth}
									height={nodeHeight}
									rx="6"
									ry="6"
									fill="#ffffff"
									stroke={borderStroke}
									strokeWidth={strokeWidth}
									strokeDasharray={strokeDasharray}
									className={cn(
										'filter drop-shadow-sm transition-all duration-300',
										status === 'running' && 'animate-pulse',
									)}
								/>
								{/* Node type header band */}
								<path
									d={`M 1 6 A 5 5 0 0 1 6 1 L ${nodeWidth - 6} 1 A 5 5 0 0 1 ${
										nodeWidth - 1
									} 6 L ${nodeWidth - 1} 18 L 1 18 Z`}
									fill={typeColor.bg}
								/>
								<text
									x="8"
									y="13"
									fontSize="9"
									fontWeight="bold"
									fill={typeColor.text}
								>
									{NODE_TYPE_LABELS[node.type] || node.type}
								</text>
								{/* Label text */}
								<text
									x="8"
									y="38"
									fontSize="12"
									fontWeight="semibold"
									fill="#0f172a"
									className="truncate"
								>
									{label.length > 22 ? `${label.slice(0, 20)}...` : label}
								</text>
								{/* Node ID */}
								<text x="8" y="52" fontSize="9" fill="#64748b">
									ID: {node.id}
								</text>
							</g>
						);
					})}
				</svg>
			)}
		</div>
	);
}

// Main Component
export function WorkflowEditor({
	initialDefinition,
	onSave,
	isSaving,
	executionStatus,
}: WorkflowEditorProps) {
	const handleEditorDidMount = (editor: any, monaco: Monaco) => {
		monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
			validate: true,
			schemas: [
				{
					uri: 'http://flowforge/workflow-schema.json',
					fileMatch: ['workflow-editor.json'],
					schema: workflowSchema,
				},
			],
		});
	};

	// Setup default starting JSON structure based on prompt
	const fallbackDefinition: WorkflowDefinition = {
		nodes: [
			{
				id: 'http-1',
				type: 'HTTP_CALL',
				config: {
					url: 'https://api.example.com/health',
					method: 'GET',
					headers: {},
				},
			},
		],
		edges: [],
	};

	const initialJSONString = React.useMemo(() => {
		const rawDef = initialDefinition || fallbackDefinition;

		// Clean nodes to remove position and data
		const cleanedNodes = (rawDef.nodes || []).map(
			({ position, data, ...rest }: any) => rest,
		);
		const cleanedDef = {
			...rawDef,
			nodes: cleanedNodes,
		};

		// Format definition inside the full payload wrapper
		const fullPayload = {
			name: 'Server Health Check',
			description: 'Optional description',
			definition: cleanedDef,
		};
		return JSON.stringify(fullPayload, null, 2);
	}, [initialDefinition]);

	const [jsonText, setJsonText] = React.useState(initialJSONString);
	const [debouncedJsonText, setDebouncedJsonText] =
		React.useState(initialJSONString);
	const [validation, setValidation] = React.useState<ValidationResult>({
		valid: true,
		errors: [],
	});

	const [saveStatus, setSaveStatus] = React.useState<
		'idle' | 'success' | 'error'
	>('idle');
	const [saveErrorMessage, setSaveErrorMessage] = React.useState<string | null>(
		null,
	);

	// Maintain the last valid layouted nodes / edges to prevent drawing crashes on partial typos
	const [lastValidLayout, setLastValidLayout] = React.useState<{
		nodes: WorkflowNode[];
		edges: DbEdge[];
		positions: NodePosition[];
	}>(() => {
		const def = initialDefinition || fallbackDefinition;
		return {
			nodes: def.nodes,
			edges: def.edges,
			positions: calculateLayout(def.nodes, def.edges),
		};
	});

	// Debounce JSON text changes
	React.useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedJsonText(jsonText);
		}, 500);

		return () => clearTimeout(timer);
	}, [jsonText]);

	// Re-validate and recalculate layout on debounced text update
	React.useEffect(() => {
		try {
			const parsed = JSON.parse(debouncedJsonText);
			const valResult = validateWorkflow(parsed);
			setValidation(valResult);

			if (valResult.valid) {
				const nodes = parsed.definition.nodes;
				const edges = parsed.definition.edges;
				const positions = calculateLayout(nodes, edges);

				setLastValidLayout({
					nodes,
					edges,
					positions,
				});
			}
		} catch (e: any) {
			setValidation({
				valid: false,
				errors: [`Invalid JSON Syntax: ${e.message}`],
			});
		}
	}, [debouncedJsonText]);

	// Auto-format helper
	const handleFormat = () => {
		try {
			const parsed = JSON.parse(jsonText);
			setJsonText(JSON.stringify(parsed, null, 2));
			setSaveStatus('idle');
		} catch (e: any) {
			setValidation({
				valid: false,
				errors: [`Invalid JSON Syntax: ${e.message}. Cannot format.`],
			});
		}
	};

	const handleEditorChange = (value: string | undefined) => {
		setJsonText(value || '');
		setSaveStatus('idle');
	};

	const handleSave = () => {
		try {
			const parsed = JSON.parse(jsonText);
			const valResult = validateWorkflow(parsed);

			if (!valResult.valid) {
				setValidation(valResult);
				setSaveStatus('error');
				const errMsg =
					'Cannot save: The workflow definition is invalid. Review error panel.';
				setSaveErrorMessage(errMsg);
				toast.error(errMsg);
				return;
			}

			setSaveStatus('idle');
			// Since workflows.tsx wraps it in api.update call, we extract the definition portion
			// and call the parent save handler with the updated definition.
			// Wait, what about name and description? They are also edited in the JSON!
			// In NestJS, name and description are passed at the root of the update body, e.g.:
			// PATCH /workflows/:id
			// Body: { name, description, definition }
			// The updateWorkflowMutation.mutate expects { name, description, definition } or just partial fields.
			// Wait, in workflows.tsx, handleSaveDefinition is:
			// const handleSaveDefinition = (definition: WorkflowDefinition) => {
			//   updateWorkflowMutation.mutate({ definition })
			// }
			// This means workflows.tsx is currently only updating the definition field!
			// Let's adapt our onSave handler or edit workflows.tsx to allow updating the name/description as well!
			// Let's check: if we pass the whole object { name, description, definition } in onSave, we can update workflows.tsx to pass it to the mutate function!
			// Let's modify onSave signature to send { name, description, definition } to the parent!
			onSave({
				name: parsed.name,
				description: parsed.description,
				definition: parsed.definition,
			} as any);

			setSaveStatus('success');
			toast.success('Workflow saved successfully!');
		} catch (e: any) {
			setSaveStatus('error');
			const errMsg = `Save Error: ${e.message}`;
			setSaveErrorMessage(errMsg);
			toast.error(errMsg);
		}
	};

	// Keep saveStatus in sync with query mutations
	React.useEffect(() => {
		if (isSaving) {
			setSaveStatus('idle');
		}
	}, [isSaving]);

	return (
		<div className="flex flex-col w-full max-w-full border rounded-lg bg-background overflow-hidden">
			{/* Legend & Layout Header */}
			<NodeTypeLegend />

			{/* Validation Panel above schema editor */}
			<div className="p-4 bg-slate-50 border-b">
				<ValidationPanel errors={validation.errors} valid={validation.valid} />
			</div>

			{/* Editor & Visualization Stacked Vertically */}
			<div className="flex flex-col flex-1 min-h-0 border-b relative">
				{/* Top: Monaco Editor */}
				<div className="w-full h-125 max-h-175 flex flex-col border-b border-slate-200">
					<div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b text-xs font-semibold text-slate-600">
						<span className="flex items-center gap-1.5">
							<FileCode className="w-3.5 h-3.5" />
							JSON Definition Editor
						</span>
						<div className="flex items-center gap-2">
							{saveStatus === 'success' && (
								<span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
									Saved!
								</span>
							)}
							{saveStatus === 'error' && (
								<span
									className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 max-w-50 truncate"
									title={saveErrorMessage || ''}
								>
									Save Error
								</span>
							)}
							<Button
								variant="outline"
								size="xs"
								onClick={handleFormat}
								className="cursor-pointer font-medium h-7"
							>
								<RefreshCw className="h-3 w-3 mr-1 text-slate-500" />
								Format
							</Button>
							<Button
								size="xs"
								onClick={handleSave}
								disabled={isSaving || !validation.valid}
								className="cursor-pointer font-medium h-7 min-w-17.5"
							>
								<Save className="h-3 w-3 mr-1" />
								{isSaving ? 'Saving...' : 'Save'}
							</Button>
							{!validation.valid && (
								<span className="text-rose-600 flex items-center gap-1 text-[10px] bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
									Invalid
								</span>
							)}
						</div>
					</div>
					<div
						className={`flex-1 min-h-0 w-full min-w-0 ${!validation.valid ? 'border-2 border-rose-500/20' : ''}`}
					>
						<Editor
							height="100%"
							defaultLanguage="json"
							path="workflow-editor.json"
							onMount={handleEditorDidMount}
							value={jsonText}
							onChange={handleEditorChange}
							options={{
								minimap: { enabled: false },
								fontSize: 13,
								fontFamily: 'var(--font-geist-mono), Courier New, monospace',
								lineNumbers: 'on',
								automaticLayout: true,
								tabSize: 2,
								scrollBeyondLastLine: false,
							}}
						/>
					</div>
				</div>

				{/* Bottom: Live SVG Visualization */}
				<div className="w-full h-125 flex flex-col">
					<div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b text-xs font-semibold text-slate-600">
						<span className="flex items-center gap-1.5">
							<GitBranch className="w-3.5 h-3.5" />
							Live Workflow Diagram
						</span>
					</div>
					<div className="flex-1 min-h-0 p-4 bg-slate-50">
						<WorkflowVisualization
							nodes={lastValidLayout.nodes}
							edges={lastValidLayout.edges}
							positions={lastValidLayout.positions}
							executionStatus={executionStatus}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
