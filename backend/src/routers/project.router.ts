import { Router } from 'express'
const projectController = require('../controllers/projectController')

const router = Router()

// PROJECT || GET ALL PROJECTS
router.get('/', projectController.allProjects_get)

// PROJECT || CREATE
router.post('/create', projectController.create_post)

// PROJECTS || GET PROJECT BY ID
router.get('/project/:id', projectController.projectById_get)

// PROJECTS || UPDATE PROJECT BY ID
router.put('/project/update', projectController.update_put)

// PROJECTS || DELETE PROJECT BY ID
router.delete('/project/delete', projectController.deleteProject_delete)

export default router;