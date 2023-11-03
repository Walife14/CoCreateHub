import express from "express"
import cors from "cors"
import { sample_users } from "./data"
import jwt from "jsonwebtoken"

const app = express()

app.use(express.json())

app.use(cors({
    credentials:true,
    origin:['http://localhost:4200']
}))

app.get('/api/foods', (req, res) => {
    res.send("hello world")
})



app.post('/api/users/login', (req, res) => {
    const { email, password } = req.body
    const user = sample_users.find(user => user.email === email && user.password && password)

    if (user) {
        res.send(generateTokenResponse(user))
    } else {
        res.status(400).send("User name or password is not valid")
    }
})

const generateTokenResponse = (user:any) => {
    const token = jwt.sign({
        email: user.email, isAdmin: user.isAdmin
    }, "SomeRandomText", {
        expiresIn: "30d"
    })
    
    user.token = token;
    return user;
}


app.listen(5000, () => {
    console.log(`Website served on port 5000`)
})