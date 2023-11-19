import { Request, Response } from 'express';
import { UserModel } from '../models/user.model';

module.exports.update_put = async(req: Request, res: Response) => {

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