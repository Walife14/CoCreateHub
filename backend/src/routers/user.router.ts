import { Router } from 'express'
import asyncHandler from 'express-async-handler'
import { UserModel } from '../models/user.model'
import { ProjectModel } from '../models/project.model'
const userController = require('../controllers/userController')

const router = Router()

// USER || UPDATE PROFILE
router.put('/update', userController.update_put)

// USER || GET USER BY ID
router.get('/user/:id', userController.userById_get)

// USER || USERS WITH VISIBILITY ON && TECHS?
router.get('/active-buddies', userController.visibleUsers_get)

// USER || INVITE USER TO PROJECT
router.put('/invite', userController.inviteUser_put)

// USER || HANDLE ACCEPT/DECLINE PROJECT INVITE
router.post('/invite/response', userController.invitationResponse_post)

export default router;