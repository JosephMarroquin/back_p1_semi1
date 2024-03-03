import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Album } from "./entities/Album";
import { Fotos } from "./entities/Fotos";
import { HOST_DATABASE, NAME_DATABASE, PASSWORD_DATABASE, PORT_DATABASE, USERNAME_DATABASE } from "./config";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: HOST_DATABASE,
    port: PORT_DATABASE,
    username: USERNAME_DATABASE,
    password: PASSWORD_DATABASE,
    database: NAME_DATABASE,
    synchronize: true,
    logging: true,
    entities: [User, Album, Fotos],
    subscribers: [],
    migrations: [],
})