import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import databaseConfig from './shared/config/database.config';
import redisConfig from './shared/config/redis.config';
import bullmqConfig from './shared/config/bullmq.config';

import { ExecutionModule } from './execution/execution.module';
import { TriggerModule } from './trigger/trigger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, redisConfig, bullmqConfig],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('redis.host'),
          port: configService.get<number>('redis.port'),
        },
      }),
      inject: [ConfigService],
    }),
    ExecutionModule,
    TriggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
