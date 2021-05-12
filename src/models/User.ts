export interface User {
    id?: string
    username?: string,
    email: string,
    role: ROLE
}


export interface UserSettings {
    userId: string
    role: ROLE,
}


export enum ROLE {
    USER = "INITIAL",
    ADMIN = "ADMIN",
}