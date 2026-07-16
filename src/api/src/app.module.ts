import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './shared/providers/prisma/prisma.module';
import { AuthModule } from './features/auth/auth.module';
import { WorkflowsModule } from './features/workflows/workflows.module';
import { OrganizationsModule } from './features/organizations/organizations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    WorkflowsModule,
    OrganizationsModule,
  ],
})
export class AppModule {}
