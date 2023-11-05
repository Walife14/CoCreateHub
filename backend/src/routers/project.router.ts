import { Router } from 'express'
import asyncHandler from 'express-async-handler'
import { HTTP_BAD_REQUEST } from '../constant/http_status'
import { Project, ProjectModel } from '../models/project.model'

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
                backgroundUrl: backgroundUrl || ''
            }

            const dbProject = await ProjectModel.create(newProject)
            res.status(200).send({"message": "New project created successfully", "created project": newProject})


        } catch (error) {
            res.status(HTTP_BAD_REQUEST).send({"message": "We couldn't create the project!"})
        }

    }
))

export default router;