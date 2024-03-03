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
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerAlbum = exports.modificarAlbum = exports.eliminarAlbum = exports.crearAlbum = void 0;
const Album_1 = require("../entities/Album");
const Fotos_1 = require("../entities/Fotos");
const User_1 = require("../entities/User");
const crearAlbum = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nombre, usuario } = req.body;
        const datosUsuario = yield User_1.User.findOneBy({ usuario: usuario });
        if (!datosUsuario)
            return res.status(404).json({ message: "usuario no existe" });
        const album = new Album_1.Album();
        album.nombre = nombre;
        album.id_user = datosUsuario.id;
        yield album.save();
        return res.json({ message: "album creado correctamente" });
    }
    catch (error) {
        if (error instanceof Error)
            return res.status(500).json({ message: error.message });
    }
});
exports.crearAlbum = crearAlbum;
const eliminarAlbum = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { usuario } = req.params;
        const user = yield User_1.User.findOneBy({ usuario: usuario });
        if (!user)
            return res.status(404).json({ message: "usuario no existe" });
        const { nombre } = req.body;
        const datosAlbum = yield Album_1.Album.findOneBy({ nombre: nombre, id_user: user.id });
        if (!datosAlbum)
            return res.status(404).json({ message: "album no existe" });
        yield Album_1.Album.delete({ id: datosAlbum.id });
        yield Fotos_1.Fotos.delete({ id_album: datosAlbum.id });
        return res.sendStatus(204);
    }
    catch (error) {
        if (error instanceof Error)
            return res.status(500).json({ message: error.message });
    }
});
exports.eliminarAlbum = eliminarAlbum;
const modificarAlbum = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { usuario } = req.params;
        const { nombre, nuevo_nombre } = req.body;
        const user = yield User_1.User.findOneBy({ usuario: usuario });
        if (!user)
            return res.status(404).json({ message: "usuario no existe" });
        const album = yield Album_1.Album.findOneBy({ nombre: nombre, id_user: user.id });
        if (!album)
            return res.status(404).json({ message: "album no existe" });
        yield Album_1.Album.update({ id: album.id }, { nombre: nuevo_nombre });
        return res.sendStatus(204);
    }
    catch (error) {
        if (error instanceof Error)
            return res.status(500).json({ message: error.message });
    }
});
exports.modificarAlbum = modificarAlbum;
const obtenerAlbum = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { usuario } = req.params;
        const datosUsuario = yield User_1.User.findOneBy({ usuario: usuario });
        if (!datosUsuario)
            return res.status(404).json({ message: "usuario no existe" });
        const albumes = yield Album_1.Album.findBy({ id_user: datosUsuario.id });
        return res.json(albumes);
    }
    catch (error) {
        if (error instanceof Error)
            return res.status(500).json({ message: error.message });
    }
});
exports.obtenerAlbum = obtenerAlbum;
