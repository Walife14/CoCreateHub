import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { Request, Response } from 'express'
import { UserModel } from '../models/user.model'

// create JWT
const createTokenResponse = (id: string, email: string, name: string, isAdmin: boolean) => {
    const token = jwt.sign({
        id, email, name, isAdmin},
        process.env.JWT_SECRET!, {
        expiresIn: '10m'})
    
    return {
        id,
        name,
        email,
        isAdmin,
        token
    }
}

// login
module.exports.login_post = async (req: Request, res: Response) => {
    const { email, password } = req.body

    try {
        const user = await UserModel.findOne({ email })

        if (user && (await bcrypt.compare(password, user.password))) {
            res.status(200).json(createTokenResponse(user.id, user.email, user.name, user.isAdmin))
        } else {
            throw 'Wrong email or password!'
        }
    } catch(error) {
        res.status(400).send({'error': error})
    }

}

// register
module.exports.register_post = async (req: Request, res: Response) => {
    const { name, email, password } = req.body

    try {
        // check if email already exists in db and throw error if true
        const exists = await UserModel.findOne({ email })
        if (exists) {
            throw 'Email is already used'
        }

        // hash the password
        const hashedPassword = await bcrypt.hash(password, 10)

        // user does not exist in the db, create a new user in db and send token
        const user = await UserModel.create({
            name,
            email,
            password: hashedPassword,
            isAdmin: false
        })

        res.status(200).json(createTokenResponse(user.id, user.email, user.name, user.isAdmin))
    } catch(error) {
        res.status(400).json({'error': error})
    }
}

// logout
// for now logout will just be the frontend client clearing the object containing jwt token from localStorage