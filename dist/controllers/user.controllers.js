"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editar_perfil = exports.confirmar_credenciales = exports.mostrar_datos_usuario = exports.createUser = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const config_1 = require("../config");
const User_1 = require("../entities/User");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const client = new client_s3_1.S3Client({
    region: `${config_1.AWS_BUCKET_REGION}`,
    credentials: {
        accessKeyId: `${config_1.AWS_PUBLIC_KEY}`,
        secretAccessKey: `${config_1.AWS_SECRET_KEY}`,
    },
});
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { usuario, name, password } = req.body;
        const buscar_user = yield User_1.User.findOneBy({ usuario: usuario });
        if (!buscar_user) {
            //subir imagen al bucket de s3
            const stream = fs_1.default.createReadStream(req.files.file.tempFilePath);
            const key_name = (0, uuid_1.v4)() + path_1.default.extname(req.files.file.name);
            const uploadParams = {
                Bucket: config_1.AWS_BUCKET_NAME,
                Key: `Fotos_Perfil/${key_name}`,
                Body: stream,
            };
            const command = new client_s3_1.PutObjectCommand(uploadParams);
            const result = yield client.send(command);
            //datos a la db
            const user = new User_1.User();
            user.usuario = usuario;
            user.name = name;
            user.password = password;
            user.foto = `https://${config_1.AWS_BUCKET_NAME}.s3.amazonaws.com/Fotos_Perfil/${key_name}`;
            yield user.save();
            //console.log(user)
            return res.json({ message: "Registrado con Exito" });
        }
        else {
            return res.status(400).json({ message: "Nombre de usuario no disponible" });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
});
exports.createUser = createUser;
const mostrar_datos_usuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { usuario } = req.params;
        const user = yield User_1.User.findOneBy({ usuario: usuario });
        return res.json(user);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
});
exports.mostrar_datos_usuario = mostrar_datos_usuario;
const confirmar_credenciales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { usuario, password } = req.body;
        const user = yield User_1.User.findOneBy({ usuario: usuario });
        if (!user)
            return res.status(404).json({ message: "usuario no encontrado" });
        if ((0, User_1.encryptPassword)(password) == user.password)
            return res.json({ message: "credenciales correctas" });
        return res.status(400).json({ message: "password incorrecta" });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
});
exports.confirmar_credenciales = confirmar_credenciales;
const editar_perfil = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userOriginal } = req.params;
        const { usuario, name } = req.body;
        const user = yield User_1.User.findOneBy({ usuario: userOriginal });
        const userNuevo = yield User_1.User.findOneBy({ usuario: usuario });
        if (!user)
            return res.status(404).json({ message: "usuario no existe" });
        if (!userNuevo || userNuevo.usuario == user.usuario) {
            //subir imagen al bucket de s3
            if (req.files != null) {
                const stream = fs_1.default.createReadStream(req.files.file.tempFilePath);
                const key_name = (0, uuid_1.v4)() + path_1.default.extname(req.files.file.name);
                const uploadParams = {
                    Bucket: config_1.AWS_BUCKET_NAME,
                    Key: `Fotos_Perfil/${key_name}`,
                    Body: stream,
                };
                const command = new client_s3_1.PutObjectCommand(uploadParams);
                const result = yield client.send(command);
                //actualizar datos
                yield User_1.User.update({ usuario: userOriginal }, {
                    usuario: usuario,
                    name: name,
                    foto: `https://${config_1.AWS_BUCKET_NAME}.s3.amazonaws.com/Fotos_Perfil/${key_name}`,
                });
                return res.json({ message: "usuario actualizado" });
            }
            else {
                yield User_1.User.update({ usuario: userOriginal }, req.body);
                return res.json({ message: "usuario actualizado" });
            }
        }
        return res.status(400).json({ message: "usuario no disponible" });
    }
    catch (error) {
        if (error instanceof Error)
            return res.status(500).json({ message: error.message });
    }
});
exports.editar_perfil = editar_perfil;
