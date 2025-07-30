export type User = {
    id: number;
    email: string;
    name: string;
    password: string;
    role: string;
    createdAt: Date;
}

export type Course = {
    id: number,
    name: string
}