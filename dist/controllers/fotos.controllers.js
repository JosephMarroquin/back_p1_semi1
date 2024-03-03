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
exports.verFotosPerfil = exports.verFotos = exports.subirFoto = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const config_1 = require("../config");
const Fotos_1 = require("../entities/Fotos");
const Album_1 = require("../entities/Album");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const User_1 = require("../entities/User");
const client = new client_s3_1.S3Client({
    region: `${config_1.AWS_BUCKET_REGION}`,
    credentials: {
        accessKeyId: `${config_1.AWS_PUBLIC_KEY}`,
        secretAccessKey: `${config_1.AWS_SECRET_KEY}`,
    },
});
const subirFoto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre_foto, id_album } = req.body;
        const datosAlbum = yield Album_1.Album.findOneBy({ id: id_album });
        if (!datosAlbum)
            return res.status(404).json({ message: "album no existe" });
        //subir imagen al bucket de s3
        const stream = fs_1.default.createReadStream(req.files.file.tempFilePath);
        const key_name = (0, uuid_1.v4)() + path_1.default.extname(req.files.file.name);
        const uploadParams = {
            Bucket: config_1.AWS_BUCKET_NAME,
            Key: `Fotos_Publicadas/${key_name}`,
            Body: stream,
        };
        const command = new client_s3_1.PutObjectCommand(uploadParams);
        const result = yield client.send(command);
        //datos a la db
        const foto = new Fotos_1.Fotos();
        foto.nombre_foto = nombre_foto;
        foto.id_album = id_album;
        foto.foto = `https://${config_1.AWS_BUCKET_NAME}.s3.amazonaws.com/Fotos_Publicadas/${key_name}`;
        yield foto.save();
        return res.json({ message: "foto subida correctamente" });
    }
    catch (error) {
        if (error instanceof Error)
            return res.status(500).json({ message: error.message });
    }
});
exports.subirFoto = subirFoto;
const verFotos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { usuario } = req.params;
        const datosUsuario = yield User_1.User.findOneBy({ usuario: usuario });
        if (!datosUsuario) {
            return res.status(404).json({ message: "usuario no existe" });
        }
        const datosAlbum = yield Album_1.Album.findBy({ id_user: datosUsuario.id });
        let guardarDatosFotos = [];
        // Utilizando Promise.all para esperar que todas las promesas se completen
        yield Promise.all(datosAlbum.map((elemento) => __awaiter(void 0, void 0, void 0, function* () {
            const fotos = yield Fotos_1.Fotos.findBy({ id_album: elemento.id });
            guardarDatosFotos.push(fotos);
        })));
        return res.json(guardarDatosFotos);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
});
exports.verFotos = verFotos;
const verFotosPerfil = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const command = new client_s3_1.ListObjectsCommand({
            Bucket: config_1.AWS_BUCKET_NAME,
            Prefix: "Fotos_Perfil"
        });
        const result = yield client.send(command);
        const fotos = result.Contents;
        const keys = fotos === null || fotos === void 0 ? void 0 : fotos.map((foto) => `https://${config_1.AWS_BUCKET_NAME}.s3.amazonaws.com/${foto.Key}`);
        return res.json(keys);
    }
    catch (error) {
        if (error instanceof Error)
            return res.status(500).json({ message: error.message });
    }
});
exports.verFotosPerfil = verFotosPerfil;
