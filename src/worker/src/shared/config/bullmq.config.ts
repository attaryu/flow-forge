import { registerAs } from '@nestjs/config';

export default registerAs('bullmq', () => ({
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
  },
  queues: {
    execution: process.env.EXECUTION_QUEUE_NAME || 'executionQueue',
    trigger: process.env.TRIGGER_QUEUE_NAME || 'triggerQueue',
  },
}));
