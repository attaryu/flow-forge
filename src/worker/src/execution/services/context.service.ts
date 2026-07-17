import { Injectable } from '@nestjs/common';
import { DatabaseProvider } from '../../shared/providers/database.provider';
import * as lodash from 'lodash';

@Injectable()
export class ContextService {
  constructor(private readonly dbProvider: DatabaseProvider) {}

  /**
   * Mengambil semua output step yang sukses sebelumnya dari database
   * dan menyusunnya dalam context object:
   * {
   *   "nodeId1": { outputData },
   *   "nodeId2": { outputData }
   * }
   */
  async buildContext(runId: string): Promise<Record<string, any>> {
    const query = `
      SELECT step_logs__step_id, output, step_logs__step_type
      FROM step_logs
      WHERE step_logs__run_id = $1 AND status = 'success'
    `;
    const res = await this.dbProvider.pool.query(query, [runId]);
    const context: Record<string, any> = {};

    for (const row of res.rows) {
      const stepId = row.step_logs__step_id;
      const rawOutput = row.output;
      let parsedOutput = rawOutput;

      if (rawOutput && (rawOutput.startsWith('{') || rawOutput.startsWith('['))) {
        try {
          parsedOutput = JSON.parse(rawOutput);
        } catch {
          // Tetap gunakan string biasa jika gagal parsing JSON
        }
      }
      context[stepId] = parsedOutput;
    }

    return context;
  }

  /**
   * Menyelesaikan string ekspresi yang mengandung referensi variabel seperti ${nodeId.field}
   * Contoh: "Status user: ${http-1.data.user_type}" -> "Status user: premium"
   */
  resolveReferences(expression: string, context: Record<string, any>): string {
    if (!expression) return expression;

    // Pattern untuk mencocokkan ${nodeId.path}
    const regex = /\${([a-zA-Z0-9_-]+)(?:\.([^}]+))?}/g;

    return expression.replace(regex, (match, nodeId, path) => {
      if (!context.hasOwnProperty(nodeId)) {
        return ''; // Node belum dieksekusi atau tidak sukses
      }

      const nodeOutput = context[nodeId];
      if (!path) {
        // Jika tidak ada path, kembalikan string representation dari full output
        return typeof nodeOutput === 'object' ? JSON.stringify(nodeOutput) : String(nodeOutput);
      }

      // Gunakan lodash.get untuk mengambil nested value (termasuk arrays seperti [0])
      const val = lodash.get(nodeOutput, path);
      if (val === undefined) {
        return '';
      }
      return typeof val === 'object' ? JSON.stringify(val) : String(val);
    });
  }

  /**
   * Melakukan resolusi referensi variabel terhadap keseluruhan object config/input
   */
  resolveObjectReferences<T>(obj: T, context: Record<string, any>): T {
    if (typeof obj === 'string') {
      return this.resolveReferences(obj, context) as any;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.resolveObjectReferences(item, context)) as any;
    }

    if (obj !== null && typeof obj === 'object') {
      const resolvedObj: any = {};
      for (const [key, value] of Object.entries(obj)) {
        resolvedObj[key] = this.resolveObjectReferences(value, context);
      }
      return resolvedObj;
    }

    return obj;
  }
}
