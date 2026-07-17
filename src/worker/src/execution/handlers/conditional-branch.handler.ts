import { Injectable } from '@nestjs/common';
import { NodeResult } from '../../shared/types/node-result.interface';

@Injectable()
export class ConditionalBranchHandler {
  async handle(config: any): Promise<NodeResult> {
    const { field, operator, value } = config;

    let result = false;
    switch (operator) {
      case 'EQUALS':
        result = String(field) === String(value);
        break;
      case 'NOT_EQUALS':
        result = String(field) !== String(value);
        break;
      case 'GREATER_THAN':
        result = Number(field) > Number(value);
        break;
      case 'CONTAINS':
        result = String(field).includes(String(value));
        break;
      default:
        return {
          status: 'failed',
          error: `Unsupported conditional operator: ${operator}`,
        };
    }

    return {
      status: 'success',
      nextHandle: result ? 'true' : 'false',
    };
  }
}
