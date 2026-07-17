import { Injectable } from '@nestjs/common';
import { NodeResult } from '../../shared/types/node-result.interface';

@Injectable()
export class DelayHandler {
  async handle(config: any): Promise<NodeResult> {
    const seconds = parseInt(config.seconds, 10);
    if (isNaN(seconds) || seconds < 1 || seconds > 86400) {
      return {
        status: 'failed',
        error: 'Invalid delay duration (must be between 1 and 86400 seconds)',
      };
    }

    // Delay node does not block the worker process.
    // It returns the delayMs so the orchestrator can enqueue the next step with job delay option.
    return {
      status: 'success',
      delayMs: seconds * 1000,
    };
  }
}
