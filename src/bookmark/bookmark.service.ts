import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  getBookmarks(userId: number) {
    return this.prisma.bookmark.findMany({ where: { userId } });
  }

  getBookmarkById(userId: number, bookmarkId: number) {
    return this.prisma.bookmark.findFirst({
      where: { id: bookmarkId, userId },
    });
  }

  async createBookmark(userId: number, dto: CreateBookmarkDto) {
    const bookmark = await this.prisma.bookmark.create({
      data: {
        userId,
        ...dto,
      },
    });
    return bookmark;
  }

  async editBookmarkById(
    userId: number,
    bookmarkId: number,
    dto: EditBookmarkDto,
  ) {
    // Get bookmark first and allow update only if it belongs to the current user
    const bookmark = await this.prisma.bookmark.findUnique({
      where: { id: bookmarkId },
    });
    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException('Access to resource denied.');

    return await this.prisma.bookmark.update({
      where: { id: bookmarkId },
      data: { ...dto },
    });
  }

  async deleteBookmarkById(userId: number, bookmarkId: number) {
    // Get bookmark first and allow delete only if it belongs to the current user
    const bookmark = await this.prisma.bookmark.findUnique({
      where: { id: bookmarkId },
    });
    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException('Access to resource denied.');
    await this.prisma.bookmark.delete({
      where: { id: bookmarkId },
    });
  }
}
