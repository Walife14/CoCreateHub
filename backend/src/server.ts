import dotenv from 'dotenv'
dotenv.config()

import express from "express"
import cors from "cors"
import authRouter from './routers/auth.router'
import userRouter from "./routers/user.router"
import projectRouter from './routers/project.router'
import { dbConnect } from './configs/database.config'
dbConnect()

const checkAuth = require('./middlewares/checkAuth')

const app = express()

app.use(express.json())

app.use(cors({
    credentials:true,
    origin:[
    'http://192.168.1.141:4200',
    'http://localhost:4200',
    'https://co-create-hub-241265baf158.herokuapp.com/',
    'https://co-create-hub-241265baf158.herokuapp.com'
]
}))



// routes
app.use('/api/auth', authRouter)
app.use('/api/users', checkAuth, userRouter)
app.use('/api/projects/', checkAuth, projectRouter)

app.listen(process.env.PORT || 80, () => {
    console.log(`Website served on port ${process.env.PORT || 80}`)
})