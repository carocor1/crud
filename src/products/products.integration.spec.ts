import { Test, TestingModule } from "@nestjs/testing";
import { ProductsService } from "./products.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductEntity } from "../entities/product.entity"; // Ruta correcta
import { ProductTypeEntity } from "../entities/productType.entity";// Asegúrate de que esta ruta sea correcta
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";

describe('ProductService Integration Test', () => {

  //lo que hacemos aca es un describe donde vamos agrupando todas las pruebas que envuelven al product service. Tomamos como parametro una descripción y una función que contiene las pruebas 

  let service: ProductsService;
  let productRepository: Repository<ProductEntity>;
  let productTypeRepository: Repository<ProductTypeEntity>;

  beforeAll(async () => {
    // Configurar el módulo de pruebas con SQLite en memoria
    const module: TestingModule = await Test.createTestingModule({

      //Se crea esto que configura el typeorm. Este módulo usa sqlLite en memoria para simular una base de datos
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [ProductEntity, ProductTypeEntity], // Asegúrate de incluir ambas entidades
          synchronize: true,
        }),
        TypeOrmModule.forFeature([ProductEntity, ProductTypeEntity]), // Incluir ambas entidades
      ],
      providers: [ProductsService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productRepository = module.get<Repository<ProductEntity>>(getRepositoryToken(ProductEntity));
    productTypeRepository = module.get<Repository<ProductTypeEntity>>(getRepositoryToken(ProductTypeEntity));
  });

  // Limpiar los datos después de cada prueba
  afterEach(async () => {
    await productRepository.clear();
    await productTypeRepository.clear();
  });

  it('debería manejar correctamente la ausencia de productos', async () => {
    // No se insertan productos en la base de datos, así que debería estar vacía.
    const productos = await service.getProducts();
    expect(productos.length).toBe(0); // Verifica que no hay productos en la BD.
  });

  it('debería obtener un único producto', async () => {
    // Primero, insertar un tipo de producto
    const tipoProducto = await productTypeRepository.save({
      name: 'Hogar',
    });
    console.log("Tipo de producto guardado:", tipoProducto);

    // Insertar un producto real en la base de datos
    const nuevoProducto = await productRepository.save({
      name: 'ProductoPrueba',
      price: 150,
      productType: tipoProducto, // Usar el tipo de producto creado
    });
    console.log('Producto creado:', nuevoProducto);
    console.log("hola")

    const productos = await service.getProducts();
    // Verificamos que se haya obtenido un solo producto de la base de datos
    expect(productos.length).toBe(1);
    expect(productos[0].name).toBe(nuevoProducto.name);
    expect(productos[0].price).toBe(nuevoProducto.price);
    expect(productos[0].productType.id).toBe(tipoProducto.id); // Verificar el tipo de producto
  });

  
  afterAll(async () => {
    await productRepository.query(`DROP TABLE IF EXISTS product_entity`);
    await productTypeRepository.query(`DROP TABLE IF EXISTS product_type`);
  });
});
