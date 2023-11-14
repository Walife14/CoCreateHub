import { Router } from 'express'
import asyncHandler from 'express-async-handler'
import { HTTP_BAD_REQUEST, HTTP_NOT_FOUND } from '../constant/http_status'
import { Project, ProjectModel } from '../models/project.model'
import { UserModel } from '../models/user.model'

const router = Router()

// PROJECT || GET ALL PROJECTS
router.get('/', asyncHandler(
    async(req, res) => {
        try {
            const projects = await ProjectModel.find({})
            res.status(200).send(projects)
        } catch(error) {
            res.status(404).send("Couldn't find any projects!")
        }
    }
))

// PROJECT || CREATE
router.post('/create', asyncHandler(
    async (req, res) => {
        try {
            const { title, description, createdAt, members, projectCreator,
                githubUrl, liveUrl, logoUrl, backgroundUrl
            } = req.body

            const newProject: Project = {
                id: '',
                title,
                description,
                createdAt,
                members,
                projectCreator,
                githubUrl: githubUrl || '',
                liveUrl: liveUrl || '',
                logoUrl: logoUrl || '',
                backgroundUrl: backgroundUrl || '',
                techs: []
            }

            const dbProject = await ProjectModel.create(newProject)
            // res.status(200).send({"message": "New project created successfully", "createdProject": dbProject})
            res.status(200).send(dbProject)


        } catch (error) {
            res.status(HTTP_BAD_REQUEST).send({"message": "We couldn't create the project!"})
        }

    }
))

// PROJECTS || GET PROJECT BY ID
router.get('/project/:id', asyncHandler(
    async (req, res) => {
        try {
            const { id } = req.params

            const project: Project = await ProjectModel.findById(id).select("-members.email").select("-projectCreator.email")

            res.status(200).send(project)
            // res.status(200).send({"message": "Successfully found project with id", project})
        } catch(error) {
            res.status(HTTP_NOT_FOUND).send({"message": "Could not find or fetch project"})
        }
    }
))

// PROJECTS || UPDATE PROJECT BY ID
router.put('/project/update', asyncHandler(
    async (req, res) => {
        try {
            const { currentUserId: userId, projectId, description, githubUrl, liveUrl, techs, visibility, title } = req.body

            const projectUpdatedFields = {
                userId, projectId, description, githubUrl, liveUrl, techs, visibility, title
            }

            const project = await ProjectModel.findById(projectId)

            // res.status(200).send(project)
            // get the project id -> check if userId === project.creatorId
            if (userId === project?.projectCreator.id) {
                const updatedProject =  await ProjectModel.findByIdAndUpdate(projectId, projectUpdatedFields)

                res.status(200).send(updatedProject)
            } else {
                throw "Failed"
            }
        } catch(error) {
            res.status(HTTP_BAD_REQUEST).send({"message": "Could not update the project by id"})
        }
    }
))

// PROJECTS || DELETE PROJECT BY ID
// NEED TO DELETE PROJECT DOCUMENT FROM PROJECT COLLECTION AND REMOVE PROJECT FROM
// USER DOCUMENT EMBEDDED PROJECTS FIELD
router.delete('/project/delete', asyncHandler(
    async (req, res) => {
        const { id } = req.body
        try {

            // delete project document from projects collection
            const deletedProject = await ProjectModel.findByIdAndDelete(id)

            // delete project from users document (embedded)
            // (Searches all users documents to see if there are any project with the id)
            const deletedUserProject = await UserModel.updateMany(
                { },
                { $pull: { projects: { id }}}
            )

            res.status(200).send({"message": "successfully deleted", "project": deletedProject, "userProject": deletedUserProject})
        } catch(error) {
            res.status(400).send({'message': `Failed to delete project with id ${id ? id : "'NO ID FOUND'"}`})
        }
    }
))

export default router;