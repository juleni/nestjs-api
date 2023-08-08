import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'), // 'postgres://avnadmin:AVNS_8iXJ50wAph_uVdDZ1wP@pg-1d04ada9-juleni-6471.aivencloud.com:12508/bookmarks?sslmode=require',
        },
      },
    });
  }

  cleanDB() {
    return this.$transaction([
      this.bookmark.deleteMany(),
      this.user.deleteMany(),
    ]);

    // Bookmarks can be cascade deleted by onDelete trigger within the Bookmark model (prisma schema)
  }
}
