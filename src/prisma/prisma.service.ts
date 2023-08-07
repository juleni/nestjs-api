import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: 'postgres://avnadmin:AVNS_8iXJ50wAph_uVdDZ1wP@pg-1d04ada9-juleni-6471.aivencloud.com:12508/bookmarks?sslmode=require',
        },
      },
    });
  }
}
