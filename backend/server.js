import dotenv from "dotenv"
dotenv.config();  
import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import path from 'path'
import { fileURLToPath } from "url";
import resumeRoutes from "./routes/resumeRoutes.js";

const _filename = fileURLToPath(import.meta.url)
const _dirname = path.dirname(_filename)

const app = express()
const PORT = 4000


app.use(cors());

//Connect DB
connectDB()

//Middleware
app.use(express.json())

app.use("/api/auth", userRoutes)
app.use('/api/resume', resumeRoutes)

app.use(
    "/uploads/",
    express.static(path.join(_dirname, 'uploads'), {
        setHeaders: (res, _path) => {
            res.set('Access-Control-Allow-Origin', "http://localhost:5173")
        }
    })
)


app.get('/', (req, res) => {
    res.send('API is Working');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});