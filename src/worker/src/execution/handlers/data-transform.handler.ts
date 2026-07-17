import { Injectable } from '@nestjs/common';
import jexl from 'jexl';
import * as lodash from 'lodash';
import { NodeResult } from '../../shared/types/node-result.interface';

@Injectable()
export class DataTransformHandler {
  /**
   * Menggunakan jexl untuk mengevaluasi ekspresi (Opsi A — Unified Jexl).
   * Menemukan semua referensi ${nodeId.path} dan memetakannya ke variabel aman
   * (e.g. var_0, var_1) agar tidak bentrok dengan operator jexl (misal hyphen di nodeId).
   */
  async handle(config: any, context: Record<string, any>): Promise<NodeResult> {
    const { expression } = config;

    if (!expression) {
      return { status: 'failed', error: 'Expression is missing' };
    }

    try {
      const jexlContext: Record<string, any> = {};
      let varCounter = 0;

      // Regex untuk mendeteksi ${nodeId.path} (termasuk array indexing seperti [0])
      const regex = /\${([a-zA-Z0-9_-]+)(?:\.([^}]+))?}/g;

      const jexlExpression = expression.replace(regex, (match: string, nodeId: string, path: string) => {
        const varName = `var_${varCounter++}`;
        
        if (!context.hasOwnProperty(nodeId)) {
          jexlContext[varName] = undefined;
          return varName;
        }

        const nodeOutput = context[nodeId];
        if (!path) {
          jexlContext[varName] = nodeOutput;
        } else {
          // lodash.get mendukung path seperti "data.users[0].name" atau "data.users.0.name"
          jexlContext[varName] = lodash.get(nodeOutput, path);
        }
        return varName;
      });

      const result = await jexl.eval(jexlExpression, jexlContext);

      return {
        status: 'success',
        output: result,
      };
    } catch (error: any) {
      return {
        status: 'failed',
        error: `Data transformation failed: ${error.message}`,
      };
    }
  }
}
