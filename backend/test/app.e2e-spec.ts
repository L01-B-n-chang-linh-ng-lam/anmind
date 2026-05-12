import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { GlobalExceptionFilter } from '../src/common/filters/global-exception.filter.js';
import { AppModule } from '../src/app.module.js';
import { DatabaseService } from '../src/database/database.service.js';
import { PrismaService } from '../src/prisma/prisma.service.js';

describe('App (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DatabaseService)
      .useValue({
        ping: jest.fn().mockResolvedValue(true),
      })
      .overrideProvider(PrismaService)
      .useValue({})
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    app.useGlobalFilters(new GlobalExceptionFilter());
    await app.init();
  });

  it('/ (GET)', () => {
    const server = app.getHttpServer() as App;

    return request(server).get('/').expect(200).expect({
      service: 'backend',
      status: 'ok',
    });
  });

  it('/health (GET)', () => {
    const server = app.getHttpServer() as App;

    return request(server).get('/health').expect(200).expect({
      status: 'ok',
      service: 'backend',
      database: 'up',
    });
  });
  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  it('POST /auth/signup - returns 400 for missing fields', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({})
      .expect(400)
      .expect((res) => {
        expect(res.body.error).toBeDefined();
        expect(res.body.error.code).toBe('VALIDATION_ERROR');
      });
  });

  it('POST /auth/login - returns 400 for missing fields', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({})
      .expect(400);
  });
});
