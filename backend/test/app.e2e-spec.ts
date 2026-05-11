import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { afterEach, beforeEach, describe, it } from '@jest/globals';
import request from 'supertest';
import { App } from 'supertest/types';
import { DatabaseService } from './../src/database/database.service';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DatabaseService)
      .useValue({
        ping: jest.fn().mockResolvedValue(true),
      })
      .compile();

    app = moduleFixture.createNestApplication();
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
});
