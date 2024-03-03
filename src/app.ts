import express from "express"
import morgan from "morgan"
import cors from "cors"
import userRoutes from "./routes/user.routes"
import albumRoutes from "./routes/album.routes"
import fotosRoutes from "./routes/fotos.routes"
import fileUpload from "express-fileupload"

const app = express()

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './uploads'
}))

app.use(morgan('dev'))
app.use(cors())
app.use(express.json())

app.use(userRoutes)
app.use(albumRoutes)
app.use(fotosRoutes)

export default app