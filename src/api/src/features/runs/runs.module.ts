import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { RunsController } from './controllers/runs.controller';
import { RunsService } from './services/runs.service';
import { SseService } from './services/sse.service';
import { RunsRepository } from './repositories/runs.repository';
import { WorkflowsModule } from '../workflows/workflows.module';
import { RedisModule } from '../../shared/providers/redis/redis.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'executionQueue',
    }),
    WorkflowsModule,
    RedisModule,
  ],
  controllers: [RunsController],
  providers: [RunsService, SseService, RunsRepository],
  exports: [RunsService, RunsRepository],
})
export class RunsModule {}
