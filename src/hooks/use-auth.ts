import { useMutation } from '@tanstack/react-query';
import { login, register, logout } from '../services/auth.service';
import { useAuth } from '../stores/authstore';

export const useLogin = () => useMutation({
    mutationFn: login,
    onSuccess: (response) => {
        useAuth.getState().setAuthenticated(response.data.user);
    },
});

export const useRegister = () => useMutation({
    mutationFn: register,
});

export const useLogout = () => useMutation({
    mutationFn: logout,
    onSuccess: () => {
        useAuth.getState().setUnauthenticated();
    },
});
