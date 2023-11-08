export class User {
    id!: string;
    email!: string;
    name!: string;
    token?: string;
    isAdmin!: boolean;
    visibility!: boolean;
    bio?: string;
    techs?: string[];
    websiteUrl?: string;
    projectGoals?: string;
    linkedinUrl?: string;
    githubUrl?: string;
}