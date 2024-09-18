import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { ProductEntity } from '../entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductTypeEntity } from '../entities/productType.entity';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: 'productos.db',
          entities: [ProductEntity, ProductTypeEntity],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([ProductEntity]),
      ],
      providers: [ProductsService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  describe('getProduct', () => {
      it('debería devolver un producto existente', async () => {
        const producto = await service.getProduct(1);
        expect(producto).toBeDefined();
        expect(producto.id).toBe(1);
      });
    });
});
