"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./entities/User");
const Album_1 = require("./entities/Album");
const Fotos_1 = require("./entities/Fotos");
const config_1 = require("./config");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: config_1.HOST_DATABASE,
    port: config_1.PORT_DATABASE,
    username: config_1.USERNAME_DATABASE,
    password: config_1.PASSWORD_DATABASE,
    database: config_1.NAME_DATABASE,
    synchronize: true,
    logging: true,
    entities: [User_1.User, Album_1.Album, Fotos_1.Fotos],
    subscribers: [],
    migrations: [],
});
