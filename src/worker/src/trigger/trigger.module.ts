import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TriggerProcessor } from './trigger.processor';
import { SchedulerService } from './services/scheduler.service';
import { ExecutionModule } from '../execution/execution.module';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: 'triggerQueue' },
      { name: 'executionQueue' },
    ),
    ExecutionModule,
  ],
  providers: [TriggerProcessor, SchedulerService],
  exports: [BullModule],
})
export class TriggerModule {}
