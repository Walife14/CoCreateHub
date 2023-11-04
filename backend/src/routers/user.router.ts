import { Router } from 'express'
import { sample_users } from '../data'
import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import { User, UserModel } from '../models/user.model'
import { HTTP_BAD_REQUEST } from '../constant/http_status'
import bcrypt from 'bcryptjs'

const router = Router()

// USER || SEED
router.get('/seed', asyncHandler(
    async (req, res) => {
        const usersCount = await UserModel.countDocuments()
        if(usersCount > 0) {
            res.send('Already Seeded!')
            return
        }

        await UserModel.create(sample_users)
        res.send('Users Seeded!')
    }
))


// USER || LOGIN
router.post('/login', asyncHandler(
    async (req, res) => {
        const { email, password } = req.body
        const user = await UserModel.findOne({ email })
    
        if (user && (await bcrypt.compare(password, user.password))) {
            res.send(generateTokenResponse(user))
        } else {
            res.status(HTTP_BAD_REQUEST).send("User name or password is not valid")
        }
    }
))

// USER || REGISTER
router.post('/register', asyncHandler(
    async (req, res) => {
        const { name, email, password } = req.body
        const user = await UserModel.findOne({ email })
        if (user) {
            res.status(HTTP_BAD_REQUEST).send("User already exists, please login!")
            return
        }
        
        const encryptedPassword = await bcrypt.hash(password, 10)

        const newUser:User = {
            id: '',
            name,
            email: email.toLowerCase(),
            password: encryptedPassword,
            isAdmin: false
        }

        const dbUser = await UserModel.create(newUser)
        res.send(generateTokenResponse(dbUser))
    }
))

// JWT TOKEN
const generateTokenResponse = (user: User) => {
    const token = jwt.sign({
        email: user.email, isAdmin: user.isAdmin
    }, process.env.JWT_SECRET!, {
        expiresIn: "3d"
    })
    
    return {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
        token: token        
    }
}

export default router;