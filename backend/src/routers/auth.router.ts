import { Router } from 'express'
const authController = require('../controllers/authController')

const router = Router()

router.post('/login', authController.login_post)
router.post('/register', authController.register_post)

router.post('/forgot-password', authController.forgotPassword_post)
router.post('/reset-password/:token', authController.resetPassword_post)

// One to handle sending the token to their email
// One that handles receiving a valid token to reset their password

export default router