import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { ProductTypesModule } from './product-types/product-types.module';
import { entities } from './entities';

@Module({
  imports: [ProductsModule, TypeOrmModule.forRoot({
    type: 'sqlite',
    database: 'productos.db',
    entities,
    synchronize:true

  }), ProductTypesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
