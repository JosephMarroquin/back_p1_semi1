"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fotos_controllers_1 = require("../controllers/fotos.controllers");
const router = (0, express_1.Router)();
router.post('/subirFoto', fotos_controllers_1.subirFoto);
router.get('/verFotos/:usuario', fotos_controllers_1.verFotos);
router.get('/verFotosPerfil', fotos_controllers_1.verFotosPerfil);
exports.default = router;
