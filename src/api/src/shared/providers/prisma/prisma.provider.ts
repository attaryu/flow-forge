import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaProvider
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private static pool: Pool;
  private static adapter: PrismaPg;

  constructor() {
    if (!PrismaProvider.pool) {
      PrismaProvider.pool = new Pool({
        connectionString: process.env.DATABASE_URL,
      });

      PrismaProvider.adapter = new PrismaPg(PrismaProvider.pool);
    }

    super({ adapter: PrismaProvider.adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();

    if (PrismaProvider.pool) {
      await PrismaProvider.pool.end();
    }
  }
}
