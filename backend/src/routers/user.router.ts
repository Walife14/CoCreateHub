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
router.post('/invite/response', asyncHandler(
    async(req, res) => {

        const { response, user, invitationId, project } = req.body

        try {

            const exists = await UserModel.findOne({_id: user.id, 'invitations._id': invitationId})

            // checking if the invitation really exists in the users invitations list
            if (exists === null) throw 'Could not find invitation in the users invitation list'

            const userAfterDeletedInvitation = await UserModel.findByIdAndUpdate(user.id, { $pull: { invitations: { _id: invitationId } }})

            // check if the user is already part of the project if so just remove the invitation
            const alreadyPartOfProject = await UserModel.findOne({_id: user.id, 'projects.id': project.id})

            if (alreadyPartOfProject != null) throw 'already part of the project!'

            // if response is true > accepted invitation
            if (response === true) {
                
                project.isProjectAdmin = false
                user.isProjectAdmin = false

                // add project to user projects
                const addProjectToUser = await UserModel.findByIdAndUpdate(user.id, { $push: { projects: project }})

                // add the user to the projects members
                const addUserToProject = await ProjectModel.findByIdAndUpdate(project.id, { $push: { members: user }})

                res.status(200).send({'message': 'Accepted invitation!'})
            } else {
            // if response is false > declined invitation

                res.status(200).send({'message': `declined invitation to ${invitationId}`})

            }
        } catch(error) {
            res.status(400).send({'message': 'Failed to accept or decline invitation!', 'error': error})
        }
    }
))

export default router;