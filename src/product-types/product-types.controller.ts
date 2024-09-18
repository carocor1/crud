import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ProductTypesService } from './product-types.service';
import { ProductTypeEntity } from 'src/entities/productType.entity';
import { DeepPartial } from 'typeorm';


@Controller('products-type')
export class ProductTypesController {
    constructor (private service: ProductTypesService){}

    @Post()
    async crearProductType (@Body() product_type: DeepPartial<ProductTypeEntity>): Promise <ProductTypeEntity>{
        return await this.service.crearProductType(product_type);
    }

    @Get(':id')
    async getProductType(@Param() param:{id:number}): Promise <ProductTypeEntity>{
        return await this.service.getProductType(param);
    }

    @Put(':id')
    async actualizarProductType(@Param() param: {id:number}, @Body() product_type: DeepPartial<ProductTypeEntity>): Promise <ProductTypeEntity>{
        return await this.service.actualizarProductType(param, product_type)
    }
    
    @Get()
    async getProductTypes(): Promise <ProductTypeEntity[]> {
        return await this.service.getProductTypes();
    }
}
