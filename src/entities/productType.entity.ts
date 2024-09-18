import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductEntity } from "./product.entity";

@Entity('productTypes')
export class ProductTypeEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name: string;

    @OneToMany( () => ProductEntity, (product) => product.productType)
    products: ProductEntity; 
}