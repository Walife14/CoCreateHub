import { Router } from 'express'
import { sample_users } from '../data'
import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import { User, UserModel } from '../models/user.model'
import { HTTP_BAD_REQUEST } from '../constant/http_status'
import bcrypt from 'bcryptjs'

const router = Router()

// USER || SEED
router.get('/seed', asyncHandler(
    async (req, res) => {
        const usersCount = await UserModel.countDocuments()
        if(usersCount > 0) {
            res.send('Already Seeded!')
            return
        }

        await UserModel.create(sample_users)
        res.send('Users Seeded!')
    }
))


// USER || LOGIN
router.post('/login', asyncHandler(
    async (req, res) => {
        const { email, password } = req.body
        const user = await UserModel.findOne({ email })
    
        if (user && (await bcrypt.compare(password, user.password))) {
            res.send(generateTokenResponse(user))
        } else {
            res.status(HTTP_BAD_REQUEST).send("User name or password is not valid")
        }
    }
))

// USER || REGISTER
router.post('/register', asyncHandler(
    async (req, res) => {
        const { name, email, password } = req.body
        const user = await UserModel.findOne({ email })
        if (user) {
            res.status(HTTP_BAD_REQUEST).send("User already exists, please login!")
            return
        }
        
        const encryptedPassword = await bcrypt.hash(password, 10)

        const newUser:User = {
            id: '',
            name,
            email: email.toLowerCase(),
            password: encryptedPassword,
            isAdmin: false,
            visibility: false
        }

        const dbUser = await UserModel.create(newUser)
        res.send(generateTokenResponse(dbUser))
    }
))

// USER || UPDATE PROFILE
router.put('/update', asyncHandler(
    async (req, res) => {
        try {
            const { id, bio, githubUrl, linkedinUrl, projectGoals, techs, websiteUrl, visibility, newProject } = req.body

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
))

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
                    visibility: fullUser.visibility
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

// JWT TOKEN
const generateTokenResponse = (user: User) => {
    const token = jwt.sign({
        email: user.email, isAdmin: user.isAdmin
    }, process.env.JWT_SECRET!, {
        expiresIn: "3d"
    })
    
    return {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
        token: token,
        bio: user?.bio || undefined,
        githubUrl: user?.githubUrl || undefined,
        linkedinUrl: user?.linkedinUrl || undefined,
        projectGoals: user?.projectGoals || undefined,
        websiteUrl: user?.websiteUrl || undefined,
        techs: user?.techs
    }
}

export default router;