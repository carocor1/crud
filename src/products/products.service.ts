import { Body, HttpException, Injectable, Param } from '@nestjs/common';
import { ProductEntity } from 'src/entities/product.entity';
import { DeepPartial } from 'typeorm';

@Injectable()
export class ProductsService {
    repository = ProductEntity

    async crearProducto(product: ProductEntity): Promise <ProductEntity> {
        if (!product.name || !product.price ||! product.productType){
            throw new HttpException ('Faltan de ingresar campos', 400)
        } 
        try {
            return await this.repository.save(product);
        }
        catch (error){
            throw new HttpException('Error en la creación del producto', 400)
        }
    } 

    async getProduct(id: number): Promise <ProductEntity> {
        const producto = await this.repository.findOne({where: {id: id}} );
        if (!producto){
            throw new HttpException('No se encontró ningún producto con el ID ingresado', 404);
        } else {
            return producto;
        }
    }

    async actualizarProduct(@Param() param: {id:number}, @Body() product:DeepPartial<ProductEntity>): Promise <ProductEntity> {
        try {
            await this.repository.update(param.id, product)
            return this.getProduct(param.id);
        } catch (error){
            throw new HttpException ('error en la actualización del producto', 500)
        }  
    }

    async getProducts(): Promise<ProductEntity[]> {
        try {
            return await this.repository.find({relations: ['productType']})
        } catch (error){
            throw new HttpException ('Error encontrando todos los productos', 505)
        }
    }
}
