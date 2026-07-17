import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpCallHandler } from './handlers/http-call.handler';
import { DelayHandler } from './handlers/delay.handler';
import { ConditionalBranchHandler } from './handlers/conditional-branch.handler';
import { DataTransformHandler } from './handlers/data-transform.handler';
import { NodeResult } from '../shared/types/node-result.interface';
import { ContextService } from './services/context.service';

@Injectable()
export class NodeExecutorService {
  constructor(
    private readonly httpCallHandler: HttpCallHandler,
    private readonly delayHandler: DelayHandler,
    private readonly conditionalBranchHandler: ConditionalBranchHandler,
    private readonly dataTransformHandler: DataTransformHandler,
    private readonly contextService: ContextService,
  ) {}

  async execute(
    node: { id: string; type: string; config?: any },
    context: Record<string, any>,
  ): Promise<NodeResult> {
    const config = node.config || {};

    switch (node.type) {
      case 'HTTP_CALL': {
        // Resolve variables di dalam URL, headers, payload terlebih dahulu
        const resolvedConfig = this.contextService.resolveObjectReferences(config, context);
        return this.httpCallHandler.handle(resolvedConfig);
      }
      
      case 'DELAY': {
        // Delay seconds config
        const resolvedConfig = this.contextService.resolveObjectReferences(config, context);
        return this.delayHandler.handle(resolvedConfig);
      }
      
      case 'CONDITIONAL_BRANCH': {
        // Resolve field (left side) and value (right side) sebelum evaluasi
        // config has: { field, operator, value }
        const resolvedConfig = this.contextService.resolveObjectReferences(config, context);
        return this.conditionalBranchHandler.handle(resolvedConfig);
      }
      
      case 'DATA_TRANSFORM': {
        // Jexl parser mengambil expression mentah dan context penuh secara internal
        return this.dataTransformHandler.handle(config, context);
      }
      
      default:
        return {
          status: 'failed',
          error: `Unknown node type: ${node.type}`,
        };
    }
  }
}
