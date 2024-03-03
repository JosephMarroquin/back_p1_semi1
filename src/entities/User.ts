import { BaseEntity, BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import * as crypto from "crypto"

// Función para encriptar una contraseña usando MD5
export const encryptPassword = (password: string): string => {
    const md5Hash = crypto.createHash('md5');
    const hashedPassword = md5Hash.update(password).digest('hex');
    return hashedPassword;
  };

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column({unique: true})
    usuario: string

    @Column()
    name: string

    @Column()
    password: string

    @Column()
    foto: string

    @BeforeInsert()
    encryptPasswordBeforeInsert() {
        this.password = encryptPassword(this.password);
      }

}