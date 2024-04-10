import { ForbiddenException, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatsModule } from '../../src/cats/cats.module';
import { CatsService } from '../../src/cats/cats.service';
import { AuthModule } from '../../src/auth/auth.module';
import { CoreModule } from '../../src/core/core.module';

describe('Cats', () => {
  const catsService = { findAll: () => ['test'], findOne: () => 'test', create: () => 'test', update: () => 'test', remove: () => 'test' };

  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres', // or your database type
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'secret@videl',
          database: 'postgres',
          entities: ['../**/*.entity.ts'], // Add your entity classes here
          synchronize: true, // This will auto-create database schema (use with caution in production)
        }),
        CatsModule, 
        AuthModule,
        CoreModule,
      ]
    })
      .overrideProvider(CatsService)
      .useValue(catsService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@gmail.com', password: '123456' });
    
    authToken = loginResponse.body.data.access_token;
        
  });  

  it(`/GET cats`, () => {
    return request(app.getHttpServer()).get('/cats').expect(200).expect({
      data: catsService.findAll(),
    });
  });

  it(`/GET cats/:id`, () => {
    return request(app.getHttpServer()).get('/cats/1').expect(200).expect({
      data: catsService.findOne(),
    });
  });

  it(`/POST cats`, async () => {
    request(app.getHttpServer())
      .post('/cats').set('Authorization', `Bearer ${authToken}`)
      .expect(200).expect(catsService.create())
      .expect(403)
      .expect({message: 'Forbidden resource', error: 'Forbidden', statusCode: 403});      
  });

  it(`/PATCH cats/:id`, async() => {
    request(app.getHttpServer())
      .patch(`/cats/1`).send({name: 'Kitty'}).set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect(catsService.update())
      .expect(403)
      .expect({message: 'Forbidden resource', error: 'Forbidden', statusCode: 403});
  });

  it(`/DELETE cats/:id`, async() => {
    request(app.getHttpServer())
      .delete(`/cats/1`).set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect(catsService.remove())
      .expect(403)
      .expect({message: 'Forbidden resource', error: 'Forbidden', statusCode: 403});
  });

  afterAll(async () => {
    await app.close();
  });
});
