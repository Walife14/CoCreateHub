import { Router } from 'express'
const authController = require('../controllers/authController')

const router = Router()

router.post('/login', authController.login_post)
router.post('/register', authController.register_post)

export default router