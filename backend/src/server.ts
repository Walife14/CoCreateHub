import dotenv from 'dotenv'
dotenv.config()

import express from "express"
import cors from "cors"
import userRouter from "./routers/user.router"
import projectRouter from './routers/project.router'
import { dbConnect } from './configs/database.config'
dbConnect()

const app = express()

app.use(express.json())

app.use(cors({
    credentials:true,
    origin:['http://192.168.1.141:4200']
}))

app.use('/api/users', userRouter)
app.use('/api/projects/', projectRouter)

app.listen(5000, () => {
    console.log(`Website served on port 5000`)
})