import { Request, Response } from "express";
import { Album } from "../entities/Album";
import { Fotos } from "../entities/Fotos";
import { User } from "../entities/User";

export const crearAlbum = async (req: Request, res: Response) => {
  try {
    const { nombre, usuario } = req.body;
    const datosUsuario = await User.findOneBy({usuario: usuario})
    if(!datosUsuario) return res.status(404).json({message:"usuario no existe"})
    const album = new Album();
    album.nombre = nombre;
    album.id_user = datosUsuario.id;

    await album.save();

    return res.json({ message: "album creado correctamente" });
  } catch (error) {
    if (error instanceof Error)
      return res.status(500).json({ message: error.message });
  }
};

export const eliminarAlbum = async (req: Request, res: Response) => {
  try {
    const { usuario } = req.params
    const user = await User.findOneBy({usuario:usuario})
    if(!user) return res.status(404).json({message:"usuario no existe"})
    const { nombre } = req.body;
    const datosAlbum = await Album.findOneBy({nombre:nombre,id_user:user.id})
    if(!datosAlbum) return res.status(404).json({message:"album no existe"})
    await Album.delete({ id: datosAlbum.id });
    await Fotos.delete({id_album:datosAlbum.id})

    return res.sendStatus(204);
  } catch (error) {
    if (error instanceof Error)
      return res.status(500).json({ message: error.message });
  }
};

export const modificarAlbum = async (req: Request, res: Response) => {
  try {
    const {usuario} = req.params
    const { nombre, nuevo_nombre } = req.body;

    const user = await User.findOneBy({usuario:usuario})
    if(!user) return res.status(404).json({message:"usuario no existe"})

    const album = await Album.findOneBy({ nombre: nombre, id_user: user.id });
    if (!album) return res.status(404).json({ message: "album no existe" });

    await Album.update({ id: album.id }, {nombre:nuevo_nombre});

    return res.sendStatus(204);
  } catch (error) {
    if (error instanceof Error)
      return res.status(500).json({ message: error.message });
  }
};

export const obtenerAlbum = async (req: Request, res: Response) => {
  try {
    const {usuario} = req.params
    const datosUsuario = await User.findOneBy({usuario:usuario})
    if(!datosUsuario) return res.status(404).json({message:"usuario no existe"})
    const albumes = await Album.findBy({id_user:datosUsuario.id})
    return res.json(albumes)
  } catch (error) {
    if(error instanceof Error) return res.status(500).json({message:error.message})
  }
}