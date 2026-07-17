import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { DatabaseProvider } from '../../shared/providers/database.provider';

@Injectable()
export class SchedulerService implements OnModuleInit {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    @InjectQueue('triggerQueue') private readonly triggerQueue: Queue,
    private readonly dbProvider: DatabaseProvider,
  ) {}

  async onModuleInit() {
    this.logger.log('Initializing scheduled workflow triggers...');
    try {
      await this.syncScheduledTriggers();
    } catch (err: any) {
      this.logger.error(`Failed to sync scheduled triggers on init: ${err.message}`, err.stack);
    }
  }

  async syncScheduledTriggers() {
    // 1. Ambil semua triggers dengan type 'scheduled' yang active
    const query = `
      SELECT 
        t.id, 
        t.workflow_triggers__workflow_id as workflow_id, 
        t.workflow_triggers__config as config, 
        w.workflows__tenant_id as tenant_id
      FROM workflow_triggers t
      JOIN workflows w ON t.workflow_triggers__workflow_id = w.id
      WHERE t.workflow_triggers__trigger_type = 'scheduled' 
        AND t.workflow_triggers__is_active = true 
        AND w.workflows__status = 'active'
    `;
    const res = await this.dbProvider.pool.query(query);
    this.logger.log(`Found ${res.rows.length} active scheduled triggers in DB.`);

    // Ambil repeatable jobs yang aktif saat ini dari queue untuk menghindari duplikasi
    const repeatableJobs = await this.triggerQueue.getRepeatableJobs();

    // Hapus repeatable jobs lama yang tidak ada lagi di database
    for (const job of repeatableJobs) {
      // Format job.name yang kita daftarkan: trigger-job:<workflowId>:<triggerId>
      const parts = job.name.split(':');
      if (parts.length >= 3) {
        const triggerId = parts[2];
        const stillExists = res.rows.some((row: any) => row.id === triggerId);
        if (!stillExists) {
          this.logger.log(`Removing deprecated repeatable job triggerId=${triggerId}`);
          await this.triggerQueue.removeRepeatableByKey(job.key);
        }
      }
    }

    // Daftarkan repeatable jobs baru
    for (const row of res.rows) {
      const { id: triggerId, workflow_id: workflowId, config, tenant_id: tenantId } = row;
      const cron = config?.cron;
      const timezone = config?.timezone || 'UTC';

      if (!cron) {
        this.logger.error(`Cron config missing for triggerId=${triggerId}`);
        continue;
      }

      const jobName = `trigger-job:${workflowId}:${triggerId}`;
      
      // Periksa apakah sudah terdaftar dengan cron pattern yang sama
      const isAlreadyRegistered = repeatableJobs.some(
        (job) => job.name === jobName && job.pattern === cron
      );

      if (!isAlreadyRegistered) {
        this.logger.log(`Registering repeatable job for workflowId=${workflowId} with cron="${cron}" tz="${timezone}"`);
        await this.triggerQueue.add(
          jobName,
          { workflowId, tenantId, triggerType: 'scheduled', triggerId },
          {
            repeat: {
              pattern: cron,
              tz: timezone,
            },
          }
        );
      }
    }
  }
}
