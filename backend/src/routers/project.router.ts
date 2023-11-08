import { Router } from 'express'
import asyncHandler from 'express-async-handler'
import { HTTP_BAD_REQUEST, HTTP_NOT_FOUND } from '../constant/http_status'
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

export default router;