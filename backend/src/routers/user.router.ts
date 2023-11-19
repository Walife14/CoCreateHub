import { Router } from 'express'
import asyncHandler from 'express-async-handler'
import { UserModel } from '../models/user.model'
import { ProjectModel } from '../models/project.model'
const userController = require('../controllers/userController')

const router = Router()

// USER || UPDATE PROFILE
router.put('/update', userController.update_put)

// USER || GET USER BY ID
router.get('/user/:id', asyncHandler(
    async (req, res) => {
        try {
            const { id } = req.params
            
            const fullUser = await UserModel.findById(id)

            if (fullUser) {
                const user = {
                    id: fullUser.id,
                    name: fullUser.name,
                    email: fullUser.email,
                    bio: fullUser.bio,
                    githubUrl: fullUser.githubUrl,
                    linkedinUrl: fullUser.linkedinUrl,
                    projectGoals: fullUser.projectGoals,
                    websiteUrl: fullUser.websiteUrl,
                    techs: fullUser.techs,
                    isAdmin: fullUser.isAdmin,
                    visibility: fullUser.visibility,
                    projects: fullUser.projects,
                    invitations: fullUser.invitations
                }
    
                res.status(200).send(user)
            }
        } catch(error) {
            res.status(400).send({'message': 'Failed to get user by id'})
        }
    }
))

// USER || USERS WITH VISIBILITY ON && TECHS?
router.get('/active-buddies', asyncHandler(
    async (req, res) => {
        try {
            const users = await UserModel.find({ visibility: true })
                .select("-isAdmin").select("-createdAt").select("-__v").select("-updatedAt")
                .select("-email")

            res.status(200).send(users)

        } catch(error) {
            res.status(400).send({'message': 'Failed to find active CoCreate buddies'})
        }
    }
))

// USER || INVITE USER TO PROJECT
router.put('/invite', asyncHandler(
    async(req, res) => {

        const { inviteeId, user, project } = req.body

        try {
            
            // note user here is user sending the invitation - NOT the receiver
            const invitationObj = {
                user: user,
                project: project
            }

            const invitation = await UserModel.findByIdAndUpdate(inviteeId, { $push: { invitations: invitationObj } })

            res.status(200).send({'message': `Successfully invited user to ${project.title}`})

        } catch (error) {
            res.status(400).send({'message': 'Failed to send invitation!'})
        }
    }
))

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