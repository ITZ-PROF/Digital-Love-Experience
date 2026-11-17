export interface signuptypes {
    fullName: string;
    email: string;
    password: string;
}

export interface loginPayload {
    email: string;
    password: string;
}

export interface AuthUser {
    id: string;
    fullName: string;
    email: string;
    emailVerifiedAt: string;
}

export interface AuthResponse {
    status: string;
    data: {
        user: AuthUser;
    };
}

export interface AuthMessageResponse {
    status: string;
    message: string;
}
