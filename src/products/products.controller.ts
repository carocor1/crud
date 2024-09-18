import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductEntity } from 'src/entities/product.entity';
import { DeepPartial } from 'typeorm';
import { AuthGuard } from 'src/middlewares/auth.middleware';

@Controller('products')
export class ProductsController {
    constructor (private service: ProductsService){}
    
    @UseGuards(new AuthGuard(1))
    @Post()
    async crearProducto(@Body() product: ProductEntity): Promise <ProductEntity> {
        return await this.service.crearProducto(product);
    }

    @UseGuards(new AuthGuard(3))
    @Get(':id')
    async getProduct(@Param() param: {id:number}): Promise <ProductEntity> {
        return await this.service.getProduct(param.id);
    } 
    @UseGuards(new AuthGuard(2))
    @Put(':id')
    async actualizarProduct(@Param() param: {id:number}, @Body() product: DeepPartial<ProductEntity>): Promise <ProductEntity>{
        return await this.service.actualizarProduct(param, product);
    }

    @UseGuards(new AuthGuard(3))
    @Get()
    async getProducts(): Promise <ProductEntity[]> {
        return await this.service.getProducts();
    }
}

