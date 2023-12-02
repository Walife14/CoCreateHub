const nodemailer = require('nodemailer')
const crypto = require('crypto')

import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { Request, Response } from 'express'
import { UserModel } from '../models/user.model'

// logout
// for now logout will just be the frontend client clearing the object containing jwt token from localStorage

// create JWT
const createTokenResponse = (id: string, email: string, name: string, isAdmin: boolean) => {
    const token = jwt.sign({
        id, email, name, isAdmin},
        process.env.JWT_SECRET!, {
        expiresIn: '2h'})
    
    return {
        id,
        name,
        email,
        isAdmin,
        token
    }
}

// email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APPPASSWORD
    }
})


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


module.exports.forgotPassword_post = async(req: Request, res: Response) => {
    
    const { email } = req.body

    try {
        // create reset token
        const resetToken = crypto.randomBytes(20).toString('hex')
        const resetTokenExpiry = Date.now() + 300000

        // update user with reken token and expiry
        const user = await UserModel.findOneAndUpdate(
            { email },
            { $set: { resetToken, resetTokenExpiry } },
            { new: true }
        )

        // check if user exists in DB
        if (!user) throw "Sorry, we couldn't find the email in our system!"

        // send the email with reset link
        const resetLink = `https://www.cocreatehub.space/auth/reset-password/${resetToken}`
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'CoCreateHub Password Reset',
            text: `Click on the following link to reset your CoCreateHub password: ${resetLink}`
        }

        await transporter.sendMail(mailOptions)

        res.status(200).send({'message': 'password reset email sent!'})
    } catch(error) {
        res.status(400).send({'message': 'failed to send password request email!', 'error': error})
    }
}

module.exports.resetPassword_post = async(req: Request, res: Response) => {
    const { password } = req.body
    const { token } = req.params

    try {
        const user = await UserModel.findOne({ resetToken: token, resetTokenExpiry: {$gt: Date.now() }})

        if (!user) throw 'Invalid or expired token'

        // hash the password before adding to user
        const hashedPassword = await bcrypt.hash(password, 10)
        user.password = hashedPassword
        user.resetToken = undefined
        user.resetTokenExpiry = undefined
        await user.save()

        res.status(200).send({'message': 'Password reset successfully' })
    } catch(error) {
        res.status(400).send({'message': 'failed to change the password!', 'error': error})
    }
}

