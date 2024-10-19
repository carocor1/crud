import { Test, TestingModule } from '@nestjs/testing';
import { ProductTypesController } from './product-types.controller';
import { ProductTypesService } from './product-types.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductTypeEntity } from '../entities/productType.entity';
import { ProductEntity } from '../entities/product.entity';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('ProductTypesController (Integration)', () => {
  let app: INestApplication;
  let service: ProductTypesService;
  const productTypeMock = { name: 'Electronics' }; // Mock de producto

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [ProductTypeEntity, ProductEntity],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([ProductTypeEntity, ProductEntity]),
      ],
      controllers: [ProductTypesController],
      providers: [ProductTypesService],
    }).compile();

    app = moduleFixture.createNestApplication();
    service = moduleFixture.get<ProductTypesService>(ProductTypesService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a new product type', async () => {
    const response = await request(app.getHttpServer())
      .post('/products-type')
      .send(productTypeMock)
      .expect(201);

    expect(response.body).toMatchObject(productTypeMock);
  });

  it('should retrieve a product type by id', async () => {
    const createdProductType = await service.crearProductType(productTypeMock);
    const response = await request(app.getHttpServer())
      .get(`/products-type/${createdProductType.id}`)
      .expect(200);

    expect(response.body).toMatchObject(productTypeMock);
  });

  it('should retrieve all product types', async () => {
    await service.crearProductType(productTypeMock);
    const response = await request(app.getHttpServer())
      .get('/products-type')
      .expect(200);

    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should update a product type', async () => {
    const createdProductType = await service.crearProductType(productTypeMock);
    const updatedProductTypeMock = { name: 'Updated Name' };
    const response = await request(app.getHttpServer())
      .put(`/products-type/${createdProductType.id}`)
      .send(updatedProductTypeMock)
      .expect(200);

    expect(response.body.name).toBe(updatedProductTypeMock.name);
  });
});

