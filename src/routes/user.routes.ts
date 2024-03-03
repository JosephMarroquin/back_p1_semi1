import { Router } from "express";
import { confirmar_credenciales, createUser, editar_perfil, mostrar_datos_usuario } from "../controllers/user.controllers";

const router = Router()

router.post('/registro', createUser)
router.get('/datosUsuario/:usuario', mostrar_datos_usuario)
router.post('/confirmarCredenciales', confirmar_credenciales)
router.put('/modificarUsuario/:userOriginal', editar_perfil)

export default router