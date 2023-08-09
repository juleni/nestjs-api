import { Injectable } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
  getBookmarks(userId: number) {
    return null;
  }

  getBookmarkById(userId: number, bookmarkId: number) {
    return null;
  }

  createBookmark(userId: number, dto: CreateBookmarkDto) {
    return null;
  }

  editBookmarkById(userId: number, bookmarkId: number, dto: EditBookmarkDto) {
    return null;
  }

  deleteBookmarkById(userId: number, bookmarkId: number) {
    return null;
  }
}
