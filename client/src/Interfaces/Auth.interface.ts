enum UserRole {
    ADMIN = 'admin',
    USER = 'user'
}

export interface ISignUpPayload {
    email: string;
    displayName: string;
    password: string;
}

export interface ISignInPayload {
    email: string;
    password: string;
}

export interface ISelfProfile {
    id: string;
    email: string;
    token: string;
    displayName: string;
    role: UserRole;
}
