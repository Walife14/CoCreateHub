import { Request, Response, NextFunction } from "express"
import jwt from 'jsonwebtoken'

module.exports = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('x-auth-token')

    if(!token) {
        return res.status(400).json({'message': 'No token found'})
    }

    try {
        let user = jwt.verify(token, process.env.JWT_SECRET!)
        next()
    } catch(error) {
        return res.status(400).json({'message': 'Token invalid'})
    }
}