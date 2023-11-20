import { Request, Response } from 'express';
import { Project, ProjectModel } from '../models/project.model';
import { HTTP_BAD_REQUEST, HTTP_NOT_FOUND } from '../constant/http_status';
import { UserModel } from '../models/user.model';

// GET ALL PROJECTS
module.exports.allProjects_get = async (req: Request, res: Response) => {
    try {
        const projects = await ProjectModel.find({})
        res.status(200).send(projects)
    } catch(error) {
        res.status(404).send("Couldn't find any projects!")
    }
}

// CREATE PROJECT
module.exports.create_post = async (req: Request, res: Response) => {
    const { ...projectFields } = req.body

    try {

        // check if projectCreator id is the same as currentUser id in case someone
        // tries to create a project for someone else
        if (!(projectFields.projectCreator.id === res.locals.jwtUser.id)) throw "You can't create a project for someone else!"

        const dbProject = await ProjectModel.create(projectFields)

        res.status(200).send(dbProject)

    } catch (error) {
        res.status(HTTP_BAD_REQUEST).send({"message": "We couldn't create the project!", "error": error})
    }
}

// GET PROJECT BY ID
module.exports.projectById_get = async (req: Request, res: Response) => {
    const { id } = req.params

    try {
        const project: Project = await ProjectModel.findById(id).select("-members.email").select("-projectCreator.email")
        res.status(200).send(project)
    } catch(error) {
        res.status(HTTP_NOT_FOUND).send({"message": "Could not find or fetch project by id"})
    }
}

// UPDATE PROJECT BY ID
module.exports.update_put = async (req: Request, res: Response) => {
    const { currentUserId: userId, projectId, description, githubUrl, liveUrl, techs, visibility, title } = req.body

    try {
        // check if I need userId now that I am using the token to get current user instead ##### I don't think so tho after test 1
        const projectUpdatedFields = {
            userId, projectId, description, githubUrl, liveUrl, techs, visibility, title
        }

        const project = await ProjectModel.findById(projectId)
            .catch((error) => {
                throw "Couldn't get project with given id!"
            })

        // check if the current user is an admin in the project if not cancel update
        if (res.locals.jwtUser.id != project!.projectCreator.id) throw "can't update a project you're not an admin in!"

        const updatedProject =  await ProjectModel.findByIdAndUpdate(projectId, projectUpdatedFields)

        res.status(200).send(updatedProject)
    } catch(error) {
        res.status(HTTP_BAD_REQUEST).send({"message": "Could not update the project by id", "error": error})
    }
}

// NEED TO DELETE PROJECT DOCUMENT FROM PROJECT COLLECTION AND REMOVE PROJECT FROM
// USER DOCUMENT EMBEDDED PROJECTS FIELD
// DELETE PROJECT BY ID
module.exports.deleteProject_delete = async (req: Request, res: Response) => {
    const { id } = req.body

    try {
        
        // project to be deleted
        const project = await ProjectModel.findById(id)
            .catch((error) => {
                throw "Couldn't get project with given id!"
            })
        
        // check if project owner is the current user if not then error
        if (!(project!.projectCreator.id === res.locals.jwtUser.id)) throw "Can't delete a project you haven't created!"

        // delete the project since the token user is the creator of the project
        const deletedProject = await ProjectModel.findByIdAndDelete(id)

        // delete project from users document (embedded)
        // (Searches all users documents to see if there are any project with the id)
        const deletedUserProject = await UserModel.updateMany(
            { },
            { $pull: { projects: { id }}}
        )

        res.status(200).send({"message": "successfully deleted", "project": deletedProject, "userProject": deletedUserProject})
    } catch(error) {
        res.status(400).send({'message': `Failed to delete project with id ${id ? id : "'NO ID FOUND'"}`, 'error': error})
    }
}