import { Router } from "express";
import { crearAlbum, eliminarAlbum, modificarAlbum, obtenerAlbum } from "../controllers/album.controllers";

const router = Router()

router.post('/crearAlbum',crearAlbum)
router.delete('/eliminarAlbum/:usuario',eliminarAlbum)
router.put('/editarAlbum/:usuario', modificarAlbum)
router.get('/obtenerAlbum/:usuario',obtenerAlbum)

export default router