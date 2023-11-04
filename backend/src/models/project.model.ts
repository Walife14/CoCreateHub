import { Schema, model } from "mongoose";

export interface ProjectUser {
    id: string;
    email: string;
    name: string;
    isProjectAdmin: boolean;
}

export interface Project {
    id: string;
    title: string;
    description: string;
    createdAt: Date;
    members: ProjectUser[];
    projectCreator: ProjectUser;
    githubUrl: string;
    liveUrl: string;
    logoUrl: string;
    backgroundUrl: string;
}

export const ProjectSchema = new Schema<Project>({
    title: {type: String, required: true},
    description: {type: String, required: true},
    createdAt: {type: Date, required: true},
    members: {type: [{
        id: String,
        email: String,
        name: String,
        isProjectAdmin: Boolean
    }], required: true},
    githubUrl: {type: String || null, required: false},
    liveUrl: {type: String || null, required: false},
    logoUrl: {type: String || null, required: false},
    backgroundUrl: {type: String || null, required: false}
}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
})

export const ProjectModel = model<Project>('Project', ProjectSchema)