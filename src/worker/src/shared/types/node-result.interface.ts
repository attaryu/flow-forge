export interface NodeResult {
  status: 'success' | 'failed';
  output?: any;
  error?: string;
  delayMs?: number;
  nextHandle?: string; // 'true' | 'false' for conditional branches
}
