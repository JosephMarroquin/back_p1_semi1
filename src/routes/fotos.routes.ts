import { Router } from "express";
import { subirFoto, verFotos, verFotosPerfil } from "../controllers/fotos.controllers";

const router = Router()

router.post('/subirFoto',  subirFoto)
router.get('/verFotos/:usuario', verFotos)
router.get('/verFotosPerfil',verFotosPerfil)

export default router