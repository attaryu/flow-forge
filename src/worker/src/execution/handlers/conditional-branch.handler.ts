import { Injectable } from '@nestjs/common';
import { NodeResult } from '../../shared/types/node-result.interface';

@Injectable()
export class ConditionalBranchHandler {
  async handle(config: any): Promise<NodeResult> {
    const { left, operator, right } = config;

    let result = false;
    switch (operator) {
      case 'EQUALS':
        result = String(left) === String(right);
        break;
      case 'NOT_EQUALS':
        result = String(left) !== String(right);
        break;
      case 'GREATER_THAN':
        result = Number(left) > Number(right);
        break;
      case 'CONTAINS':
        result = String(left).includes(String(right));
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
