import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from './shared/providers/prisma/prisma.module';
import { AuthModule } from './features/auth/auth.module';
import { WorkflowsModule } from './features/workflows/workflows.module';
import { OrganizationsModule } from './features/organizations/organizations.module';
import { RunsModule } from './features/runs/runs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST') || 'localhost',
          port: parseInt(configService.get<string>('REDIS_PORT') || '6379', 10),
        },
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
    AuthModule,
    WorkflowsModule,
    OrganizationsModule,
    RunsModule,
  ],
})
export class AppModule {}
