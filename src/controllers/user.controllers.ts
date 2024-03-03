import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import {
  AWS_BUCKET_NAME,
  AWS_BUCKET_REGION,
  AWS_PUBLIC_KEY,
  AWS_SECRET_KEY,
} from "../config";
import { Request, Response } from "express";
import { User, encryptPassword } from "../entities/User";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const client = new S3Client({
  region: `${AWS_BUCKET_REGION}`,
  credentials: {
    accessKeyId: `${AWS_PUBLIC_KEY}`,
    secretAccessKey: `${AWS_SECRET_KEY}`,
  },
});

export const createUser = async (req: Request, res: Response) => {
  try {
    const { usuario, name, password } = req.body;
    const buscar_user = await User.findOneBy({ usuario: usuario });

    if (!buscar_user) {
      //subir imagen al bucket de s3
      const stream = fs.createReadStream((req.files as any).file.tempFilePath);
      const key_name = uuidv4() + path.extname((req.files as any).file.name);
      const uploadParams = {
        Bucket: AWS_BUCKET_NAME,
        Key: `Fotos_Perfil/${key_name}`,
        Body: stream,
      };
      const command = new PutObjectCommand(uploadParams);
      const result = await client.send(command);

      //datos a la db

      const user = new User();
      user.usuario = usuario;
      user.name = name;
      user.password = password;
      user.foto = `https://${AWS_BUCKET_NAME}.s3.amazonaws.com/Fotos_Perfil/${key_name}`;

      await user.save();

      //console.log(user)

      return res.json({ message: "Registrado con Exito" });
    } else {
      return res.status(400).json({ message: "Nombre de usuario no disponible" });
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export const mostrar_datos_usuario = async (req: Request, res: Response) => {
  try {
    const { usuario } = req.params;
    const user = await User.findOneBy({ usuario: usuario });
    return res.json(user);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export const confirmar_credenciales = async (req: Request, res: Response) => {
  try {
    const { usuario, password } = req.body;
    const user = await User.findOneBy({ usuario: usuario });

    if (!user)
      return res.status(404).json({ message: "usuario no encontrado" });

    if (encryptPassword(password) == user.password)
      return res.json({ message: "credenciales correctas" });

    return res.status(400).json({ message: "password incorrecta" });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export const editar_perfil = async (req: Request, res: Response) => {
  try {
    const { userOriginal } = req.params;
    const { usuario, name } = req.body;
    const user = await User.findOneBy({ usuario: userOriginal });
    const userNuevo = await User.findOneBy({ usuario: usuario });

    if (!user) return res.status(404).json({ message: "usuario no existe" });

    if (!userNuevo || userNuevo.usuario == user.usuario) {
      //subir imagen al bucket de s3
      if (req.files != null) {
        const stream = fs.createReadStream(
          (req.files as any).file.tempFilePath
        );
        const key_name = uuidv4() + path.extname((req.files as any).file.name);
        const uploadParams = {
          Bucket: AWS_BUCKET_NAME,
          Key: `Fotos_Perfil/${key_name}`,
          Body: stream,
        };
        const command = new PutObjectCommand(uploadParams);
        const result = await client.send(command);

        //actualizar datos
        await User.update(
          { usuario: userOriginal },
          {
            usuario: usuario,
            name: name,
            foto: `https://${AWS_BUCKET_NAME}.s3.amazonaws.com/Fotos_Perfil/${key_name}`,
          }
        );
        return res.json({ message: "usuario actualizado" });
      }else{
        await User.update({usuario: userOriginal},req.body)
        return res.json({ message: "usuario actualizado" });
      }
    }

    return res.status(400).json({ message: "usuario no disponible" });
  } catch (error) {
    if (error instanceof Error)
      return res.status(500).json({ message: error.message });
  }
};
