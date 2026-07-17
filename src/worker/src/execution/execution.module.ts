import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { DatabaseProvider } from '../shared/providers/database.provider';
import { RedisProvider } from '../shared/providers/redis.provider';
import { HttpCallHandler } from './handlers/http-call.handler';
import { DelayHandler } from './handlers/delay.handler';
import { ConditionalBranchHandler } from './handlers/conditional-branch.handler';
import { DataTransformHandler } from './handlers/data-transform.handler';
import { ContextService } from './services/context.service';
import { StepLoggerService } from './services/step-logger.service';
import { RunManagerService } from './services/run-manager.service';
import { NodeExecutorService } from './node-executor.service';
import { ExecutionProcessor } from './execution.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'executionQueue',
    }),
  ],
  providers: [
    DatabaseProvider,
    RedisProvider,
    HttpCallHandler,
    DelayHandler,
    ConditionalBranchHandler,
    DataTransformHandler,
    ContextService,
    StepLoggerService,
    RunManagerService,
    NodeExecutorService,
    ExecutionProcessor,
  ],
  exports: [
    DatabaseProvider,
    RedisProvider,
    RunManagerService,
    BullModule,
  ],
})
export class ExecutionModule {}
