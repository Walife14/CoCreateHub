export interface Project {
    backgroundUrl?: string;
    createdAt: Date;
    description: string;
    githubUrl?: string;
    id: string;
    liveUrl?: string;
    logoUrl?: string;
    members: {id: string, email: string, name: string, isProjectAdmin: boolean, _id: string}[];
    projectCreator: {id: string, email: string, name: string, isProjectAdmin: boolean, _id: string};
    title: string;
    updatedAt: Date;
    __v: number;
    _id: string;
}
