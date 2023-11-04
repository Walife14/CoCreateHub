import { Router } from 'express'
import asyncHandler from 'express-async-handler'
import { HTTP_BAD_REQUEST } from '../constant/http_status'
import { Project, ProjectModel } from '../models/project.model'

const router = Router()

// PROJECT || CREATE
router.post('/create', asyncHandler(
    async (req, res) => {
        const { title, description, createdAt, members, projectCreator,
                githubUrl, liveUrl, logoUrl, backgroundUrl
        } = req.body
        
        try {

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
            res.status(200).send('Created new project!')


        } catch (error) {
            res.status(HTTP_BAD_REQUEST).send("We couldn't create the project!")
        }

    }
))

export default router;