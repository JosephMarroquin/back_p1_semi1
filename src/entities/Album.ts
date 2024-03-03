import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Album extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nombre: string

    @Column()
    id_user: number

}