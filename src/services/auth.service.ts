import { api } from '../utils/request';
import {
    AuthMessageResponse,
    AuthResponse,
    loginPayload,
    signuptypes,
} from '../types/types';

export const login = async (credentials: loginPayload): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
};

export const register = async (credentials: signuptypes): Promise<AuthMessageResponse> => {
    const response = await api.post<AuthMessageResponse>('/auth/register', credentials);
    return response.data;
};

export const getCurrentUser = async (): Promise<AuthResponse> => {
    const response = await api.get<AuthResponse>('/auth/me');
    return response.data;
};

export const verifyEmail = async (token: string): Promise<AuthMessageResponse> => {
    const response = await api.post<AuthMessageResponse>('/auth/verify-email', { token });
    return response.data;
};

export const resendVerificationEmail = async (email: string): Promise<AuthMessageResponse> => {
    const response = await api.post<AuthMessageResponse>('/auth/resend-verification', { email });
    return response.data;
};

export const requestPasswordReset = async (email: string): Promise<AuthMessageResponse> => {
    const response = await api.post<AuthMessageResponse>('/auth/password-reset/request', { email });
    return response.data;
};

export const resetPassword = async (token: string, password: string): Promise<AuthMessageResponse> => {
    const response = await api.post<AuthMessageResponse>('/auth/password-reset/confirm', { token, password });
    return response.data;
};

export const logout = async (): Promise<AuthMessageResponse> => {
    const response = await api.post<AuthMessageResponse>('/auth/logout');
    return response.data;
};
