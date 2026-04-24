export type Role = "USER" | "FARMER" | "NUTRITIONIST";

export interface User {
    id: number;
    email: string;
    name: string;
    role: Role;
}

export interface AuthResponse{
    access_token: string;
    user: User;
}