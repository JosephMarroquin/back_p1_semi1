import { config } from "dotenv";

config()

export const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME
export const AWS_BUCKET_REGION = process.env.AWS_BUCKET_REGION
export const AWS_PUBLIC_KEY = process.env.AWS_PUBLIC_KEY
export const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY
export const HOST_DATABASE = process.env.HOST_DATABASE
export const PORT_DATABASE: number | undefined = process.env.PORT_DATABASE ? parseInt(process.env.PORT_DATABASE) : undefined;
export const USERNAME_DATABASE = process.env.USERNAME_DATABASE
export const PASSWORD_DATABASE = process.env.PASSWORD_DATABASE
export const NAME_DATABASE = process.env.NAME_DATABASE