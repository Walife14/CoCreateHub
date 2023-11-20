import { Request, Response } from 'express';
import { UserModel } from '../models/user.model';
import { ProjectModel } from '../models/project.model';

// UPDATE CURRENT USER
module.exports.update_put = async (req: Request, res: Response) => {

    const { id, bio, githubUrl, linkedinUrl, projectGoals, techs, websiteUrl, visibility, newProject } = req.body

    try {

        // check if the user trying to update the profile is also the user with the jwt token
        // if not then just throw an error saying you cant change someone else's profile data!
        if (res.locals.jwtUser.id != id) throw "You can't change someone elses profile!"

        // check if we're only adding a project to the user projects array if not then just update user info
        if (newProject) {
            const userToAddProject = await UserModel.findById(id)
            userToAddProject?.projects?.push(newProject)
            userToAddProject?.save()
            res.status(200).send({"message": "successfully added project to user"})
        } else {
            const updatedFields = {
                bio,
                githubUrl,
                linkedinUrl,
                projectGoals,
                websiteUrl,
                techs,
                visibility
            }

            const updatedUser = await UserModel.findByIdAndUpdate(id, {$set: updatedFields})
            res.status(200).send({'message': 'Successfully updated user'})
            
        }
    } catch(error) {
        res.status(400).send({'message': 'Failed to update user', 'error': error})
    }
}

// GET USER BY ID
module.exports.userById_get = async (req: Request, res: Response) => {

    const { id } = req.params

    try {
        // exclude sensitive fields from the fetch
        const user = await UserModel.findById(id).select('-password -createdAt -updatedAt -__v')
        
        // if there is no user then throw error no user by id exists
        if (!user) throw `Could not find any user with id ${id}`

        res.status(200).json(user)
    } catch(error) {
        res.status(400).send({'message': 'Failed to get user by id', 'error': error})
    }
}

// GET ALL USERS WITH VISIBILITY ON
module.exports.visibleUsers_get = async (req: Request, res: Response) => {

    try {
        const users = await UserModel.find({ visibility: true }).select('-password -createdAt -updatedAt -__v')

        res.status(200).send(users)
    } catch(error) {
        res.status(400).send({'message': 'Could not fetch users with visibility set to true', 'error': error})
    }

}

// Send invitation
module.exports.inviteUser_put = async(req: Request, res: Response) => {
    
    const { inviteeId, user, project } = req.body

    try {
        // check if the token user is the same user we're given here if not throw error
        if (user.id != res.locals.jwtUser.id ) throw 'Cannot send invites in other users behalf!'

        // checking if project with id exists
        const grabbedProject = await ProjectModel.findById(project.id)
            .catch((error) => {
                throw 'Invalid id!'
            })
        // check if the user here is part of the project && admin in the project, if not throw error
        const currentUserInProject = grabbedProject?.members.find(obj => obj.id === res.locals.jwtUser.id)
        if(currentUserInProject) {
            if(currentUserInProject.isProjectAdmin) {
                
                // note user here is the user sending the invitation - NOT the receiver
                const invitationObj = {
                    user: user,
                    project: project
                }

                const invitation = await UserModel.findByIdAndUpdate(inviteeId, { $push: { invitations: invitationObj } })

                res.status(200).send({'message': `Successfully invited user to ${project.title}`, 'project': grabbedProject})

            } else {
                // throw error since you can only invite users to project if you're an admin in the project!
                throw 'Current user inviting is not an admin of the project'
            }
        } else {
            // if the currentUserInProject is null it means that the current user is not part
            // of the project that they're being invited into
            throw 'Current user is not in the project to be able to invite someone!'
        }
    } catch (error) {
        res.status(400).send({'message': 'Failed to send invitation!', 'error': error})
    }
}