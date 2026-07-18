import { Module } from '@nestjs/common';
import { WorkflowsController } from './controllers/workflows.controller';
import { WorkflowsService } from './services/workflows.service';
import { WorkflowsRepository } from './repositories/workflows.repository';

@Module({
  controllers: [WorkflowsController],
  providers: [WorkflowsService, WorkflowsRepository],
  exports: [WorkflowsService],
})
export class WorkflowsModule {}
