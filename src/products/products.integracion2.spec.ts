import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app.module'; // Cambia esto según tu estructura de módulos

describe('Products API (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Simula el login para obtener el token de acceso
    const loginResponse = await request('http://localhost:3000') // Cambia esto a la URL de tu API de usuarios
      .post('/users/login') // Ruta del login
      .send({
        email: 'carolinapaulacorazza@gmail.com', // Usa un email válido
        password: 'carolina', // Usa una contraseña válida
      });

    accessToken = loginResponse.body.accessToken; // Captura el token de acceso
  });

  afterAll(async () => {
    await app.close();
  });

  it('/products (GET) - debería devolver todos los productos si el usuario está autenticado', async () => {
    const response = await request(app.getHttpServer())
      .get('/products') // Endpoint para obtener productos
      .set('Authorization', `Bearer ${accessToken}`) // Añade el token en la cabecera
      .expect(200); // Espera un estado 200

    console.log("Productos:", response.body);
  });
});
