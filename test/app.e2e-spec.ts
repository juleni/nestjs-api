import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';
import { CreateBookmarkDto, EditBookmarkDto } from 'src/bookmark/dto';
import { EditUserDto } from 'src/user/dto';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    await app.listen(3333); // start test server

    prisma = app.get(PrismaService);
    await prisma.cleanDB();
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = { email: 'test@email.com', password: 'test-passwd' };

    describe('Signup', () => {
      it('should throw error for empty email', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ email: '', password: dto.password })
          .expectStatus(400);
        //.inspect(); // Show log in the console
      });

      it('should throw error for empty password', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ email: dto.email, password: '' })
          .expectStatus(400);
        //.inspect(); // Show log in the console
      });

      it('should throw error for empty body', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({})
          .expectStatus(400);
        //.inspect(); // Show log in the console
      });

      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
        //.inspect(); // Show log in the console
      });
    });

    describe('Signin', () => {
      it('should throw error for empty email', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ email: '', password: dto.password })
          .expectStatus(400);
        //.inspect(); // Show log in the console
      });

      it('should throw error for empty password', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ email: dto.email, password: '' })
          .expectStatus(400);
        //.inspect(); // Show log in the console
      });

      it('should throw error for empty body', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({})
          .expectStatus(400);
        //.inspect(); // Show log in the console
      });

      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
        //.inspect(); // Show log in the console
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200);
        // .inspect(); // Show log in the console
      });
    });
    describe('Edit user', () => {
      it('should edit user', () => {
        const dto: EditUserDto = {
          firstName: 'FirstNameUpdated',
          email: 'test-updated@email.com',
        };
        return pactum
          .spec()
          .patch('/users')
          .withBody(dto)
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.email);
        // .inspect(); // Show log in the console
      });
    });
  });

  describe('Bookmarks', () => {
    describe('Get empty Bookmarks', () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200)
          .expectBody([]);
        //.inspect(); // Show log in the console
      });
    });
    describe('Create Bookmark', () => {
      it('should create bookmark', () => {
        const dto: CreateBookmarkDto = {
          title: 'Test Bookmark',
          link: 'http://testlink.com',
        };
        return pactum
          .spec()
          .post('/bookmarks')
          .withBody(dto)
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(201)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.link)
          .stores('bookmarkId', 'id');
        //.inspect(); // Show log in the console
      });
    });
    describe('Get not empty Bookmarks', () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200)
          .expectJsonLength(1);
        //.inspect(); // Show log in the console
      });
    });
    describe('Get Bookmark by ID', () => {
      it('should get bookmark by ID', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}');
        //.inspect(); // Show log in the console
      });
    });
    describe('Edit Bookmark by ID', () => {
      const dto: EditBookmarkDto = {
        title: 'Updated title',
        description: 'Updated description',
      };
      it('should edit bookmark', () => {
        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withBody(dto)
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description);
        //.inspect(); // Show log in the console
      });
    });
    describe('Delete Bookmark by ID', () => {
      it('should delete bookmark', () => {
        return pactum
          .spec()
          .delete('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(204);
        //.inspect(); // Show log in the console
      });
      it('should get empty bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200)
          .expectBody([]);
        //.inspect(); // Show log in the console
      });
    });
  });
});
