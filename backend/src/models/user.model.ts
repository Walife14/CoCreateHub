import { Schema, model } from 'mongoose'

export interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    isAdmin: boolean;
    bio?: string;
    githubUrl?: string;
    linkedinUrl?: string;
    projectGoals?: string;
    websiteUrl?: string;
    techs?: string[];
}

// export interface UserUpdate {
//     bio: string;
//     githubUrl: string;
//     linkedinUrl: string;
//     projectGoals: string;
//     websiteUrl: string;
//     techs: string[]
// }

export const UserSchema = new Schema<User>({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    isAdmin: {type: Boolean, required: true},
    bio: {type: String, required: false},
    githubUrl: {type: String, required: false},
    linkedinUrl: {type: String, required: false},
    projectGoals: {type: String, required: false},
    techs: {type: [String], required: false},
    websiteUrl: {type: String, required: false},
}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
})

export const UserModel = model<User>('user', UserSchema)