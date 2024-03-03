import { ListObjectsCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import {
  AWS_BUCKET_NAME,
  AWS_BUCKET_REGION,
  AWS_PUBLIC_KEY,
  AWS_SECRET_KEY,
} from "../config";
import { Request, Response } from "express";
import { Fotos } from "../entities/Fotos";
import { Album } from "../entities/Album";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { User } from "../entities/User";

const client = new S3Client({
  region: `${AWS_BUCKET_REGION}`,
  credentials: {
    accessKeyId: `${AWS_PUBLIC_KEY}`,
    secretAccessKey: `${AWS_SECRET_KEY}`,
  },
});

export const subirFoto = async (req: Request, res: Response) => {
  try {
    const { nombre_foto, id_album } = req.body;
    const datosAlbum = await Album.findOneBy({id:id_album})
    if(!datosAlbum) return res.status(404).json({message:"album no existe"})

    //subir imagen al bucket de s3
    const stream = fs.createReadStream((req.files as any).file.tempFilePath);
    const key_name = uuidv4() + path.extname((req.files as any).file.name);
    const uploadParams = {
      Bucket: AWS_BUCKET_NAME,
      Key: `Fotos_Publicadas/${key_name}`,
      Body: stream,
    };
    const command = new PutObjectCommand(uploadParams);
    const result = await client.send(command);

    //datos a la db
    const foto = new Fotos()
    foto.nombre_foto = nombre_foto
    foto.id_album = id_album
    foto.foto = `https://${AWS_BUCKET_NAME}.s3.amazonaws.com/Fotos_Publicadas/${key_name}`;

    await foto.save()

    return res.json({ message: "foto subida correctamente" });
  } catch (error) {
    if (error instanceof Error)
      return res.status(500).json({ message: error.message });
  }
};

export const verFotos = async (req: Request, res: Response) => {
  try {
    const { usuario } = req.params;
    const datosUsuario = await User.findOneBy({ usuario: usuario });

    if (!datosUsuario) {
      return res.status(404).json({ message: "usuario no existe" });
    }

    const datosAlbum = await Album.findBy({ id_user: datosUsuario.id });

    let guardarDatosFotos: object[] = [];

    // Utilizando Promise.all para esperar que todas las promesas se completen
    await Promise.all(datosAlbum.map(async (elemento) => {
      const fotos = await Fotos.findBy({ id_album: elemento.id });
      guardarDatosFotos.push(fotos);
    }));

    return res.json(guardarDatosFotos);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export const verFotosPerfil = async (req: Request, res: Response) => {
  try {
    const command = new ListObjectsCommand({
      Bucket: AWS_BUCKET_NAME,
      Prefix: "Fotos_Perfil"
    })
    const result = await client.send(command)
    const fotos = result.Contents;
    const keys = fotos?.map((foto) => `https://${AWS_BUCKET_NAME}.s3.amazonaws.com/${foto.Key}`);
    return res.json(keys);
  } catch (error) {
    if(error instanceof Error) return res.status(500).json({message:error.message})
  }
}