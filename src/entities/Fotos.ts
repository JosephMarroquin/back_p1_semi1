import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Fotos extends BaseEntity {

    @PrimaryGeneratedColumn()
    id:number

    @Column()
    nombre_foto: string

    @Column()
    id_album: number

    @Column()
    foto: string

}