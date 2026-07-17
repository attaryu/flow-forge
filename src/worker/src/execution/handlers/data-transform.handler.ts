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
    const { mode } = config;

    try {
      if (mode === 'simple') {
        return await this.handleSimpleMode(config, context);
      } else {
        return await this.handleAdvancedMode(config, context);
      }
    } catch (error: any) {
      return {
        status: 'failed',
        error: `Data transformation failed: ${error.message}`,
      };
    }
  }

  private async handleSimpleMode(config: any, context: Record<string, any>): Promise<NodeResult> {
    const { operation, inputs } = config;

    if (!operation) {
      return { status: 'failed', error: 'Operation is missing for simple mode' };
    }
    if (!Array.isArray(inputs)) {
      return { status: 'failed', error: 'Inputs must be an array for simple mode' };
    }

    // Resolve setiap input dari context
    const resolvedValues = inputs.map(input => {
      const val = input.value;
      if (typeof val !== 'string') return val;
      return this.resolveStringValue(val, context);
    });

    let result: any;
    switch (operation) {
      case 'CONCAT':
        result = resolvedValues.map(v => (v === undefined || v === null ? '' : String(v))).join('');
        break;
      case 'ADD':
        result = resolvedValues.reduce((sum, v) => sum + (isNaN(Number(v)) ? 0 : Number(v)), 0);
        break;
      case 'SUBTRACT':
        if (resolvedValues.length < 2) {
          return { status: 'failed', error: 'SUBTRACT operation requires at least 2 inputs' };
        }
        result = Number(resolvedValues[0]) - Number(resolvedValues[1]);
        break;
      case 'MULTIPLY':
        result = resolvedValues.reduce((prod, v, idx) => {
          const num = isNaN(Number(v)) ? 0 : Number(v);
          return idx === 0 ? num : prod * num;
        }, 0);
        break;
      case 'DIVIDE':
        if (resolvedValues.length < 2) {
          return { status: 'failed', error: 'DIVIDE operation requires at least 2 inputs' };
        }
        const divisor = Number(resolvedValues[1]);
        if (divisor === 0) {
          return { status: 'failed', error: 'Division by zero is not allowed' };
        }
        result = Number(resolvedValues[0]) / divisor;
        break;
      case 'MODULO':
        if (resolvedValues.length < 2) {
          return { status: 'failed', error: 'MODULO operation requires at least 2 inputs' };
        }
        const modDivisor = Number(resolvedValues[1]);
        if (modDivisor === 0) {
          return { status: 'failed', error: 'Modulo by zero is not allowed' };
        }
        result = Number(resolvedValues[0]) % modDivisor;
        break;
      case 'UPPERCASE':
        if (resolvedValues.length < 1) {
          return { status: 'failed', error: 'UPPERCASE operation requires at least 1 input' };
        }
        result = String(resolvedValues[0]).toUpperCase();
        break;
      case 'LOWERCASE':
        if (resolvedValues.length < 1) {
          return { status: 'failed', error: 'LOWERCASE operation requires at least 1 input' };
        }
        result = String(resolvedValues[0]).toLowerCase();
        break;
      case 'TRIM':
        if (resolvedValues.length < 1) {
          return { status: 'failed', error: 'TRIM operation requires at least 1 input' };
        }
        result = String(resolvedValues[0]).trim();
        break;
      case 'SUBSTRING':
        if (resolvedValues.length < 2) {
          return { status: 'failed', error: 'SUBSTRING operation requires at least 2 inputs (string and start index)' };
        }
        const str = String(resolvedValues[0]);
        const start = Number(resolvedValues[1]);
        const end = resolvedValues[2] !== undefined ? Number(resolvedValues[2]) : undefined;
        result = str.substring(start, end);
        break;
      default:
        return { status: 'failed', error: `Unsupported simple operation: ${operation}` };
    }

    return {
      status: 'success',
      output: result,
    };
  }

  private async handleAdvancedMode(config: any, context: Record<string, any>): Promise<NodeResult> {
    const { expression } = config;

    if (!expression) {
      return { status: 'failed', error: 'Expression is missing' };
    }

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
        jexlContext[varName] = lodash.get(nodeOutput, path);
      }
      return varName;
    });

    const result = await jexl.eval(jexlExpression, jexlContext);

    return {
      status: 'success',
      output: result,
    };
  }

  /**
   * Helper untuk meresolve string tunggal yang mungkin berisi pattern ${nodeId.path}
   * Jika string bernilai tepat "${nodeId.path}" (tidak ada teks sekitarnya),
   * kita kembalikan tipe data aslinya (misal Object/Array/Number).
   * Jika dicampur teks (misal "Fakta: ${nodeId.fact}"), kita kembalikan string hasil interpolasi.
   */
  private resolveStringValue(val: string, context: Record<string, any>): any {
    const regex = /^\${([a-zA-Z0-9_-]+)(?:\.([^}]+))?}$/;
    const match = val.match(regex);

    // Kasus 1: Tepat satu placeholder (tanpa teks ekstra) -> pertahankan tipe data asli
    if (match) {
      const [, nodeId, path] = match;
      if (!context.hasOwnProperty(nodeId)) {
        return undefined;
      }
      const nodeOutput = context[nodeId];
      return path ? lodash.get(nodeOutput, path) : nodeOutput;
    }

    // Kasus 2: Interpolasi string campuran (misal: "Halo ${nodeId.name}")
    const globalRegex = /\${([a-zA-Z0-9_-]+)(?:\.([^}]+))?}/g;
    return val.replace(globalRegex, (m: string, nodeId: string, path: string) => {
      if (!context.hasOwnProperty(nodeId)) {
        return '';
      }
      const nodeOutput = context[nodeId];
      const resolved = path ? lodash.get(nodeOutput, path) : nodeOutput;
      return resolved === undefined || resolved === null ? '' : String(resolved);
    });
  }
}
