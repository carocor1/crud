import { HttpException, Injectable } from '@nestjs/common';
import { ProductTypeEntity } from 'src/entities/productType.entity';
import { DeepPartial } from 'typeorm';

@Injectable()
export class ProductTypesService {
    repository = ProductTypeEntity

    async crearProductType(product_type: DeepPartial<ProductTypeEntity>): Promise <ProductTypeEntity>{
        try {
            return await this.repository.save(product_type); 
        } catch (error) {
            throw new HttpException('Error en la creación del tipo de producto', 400);
        }
    }

    async getProductType(param:{id:number}): Promise <ProductTypeEntity>{
        const productType = await this.repository.findOne({where:{id:param.id}})
        
        if (!productType){
            throw new HttpException('No se encontró ningun tipo de producto con el ID ingresado', 404)
        } else{
            return productType;
        }
    }

    async actualizarProductType(param: {id:number}, product_type: DeepPartial<ProductTypeEntity>): Promise <ProductTypeEntity>{
        try {
            this.repository.update(param.id, product_type);
            return this.getProductType(param);
        } catch (error){
            throw new HttpException('Error en la actualizacion del producto', 505);
        }
    }

    async getProductTypes(): Promise <ProductTypeEntity[]>{
        try {
            return await this.repository.find();
        } catch (error){
            throw new HttpException('error encontrando los tipos de productos', 505);
        }
    } 
}
