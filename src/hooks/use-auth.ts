import {useMutation} from "@tanstack/react-query";
import {login, register, logout} from "../services/auth.service";
import {useAuth} from "../stores/authstore";


const { setAuthenticated} = useAuth.getState();

export const useLogin = ()=> useMutation({
    mutationFn:  login,
    onSuccess: (data) => {
        // Handle successful login, e.g., store user data, redirect, etc.
        console.log('Login successful:', data);
        setAuthenticated(true); // Update Zustand global state
    },
    onError: (error) => {
        // Handle login error, e.g., show error message to user
        console.error('Login error:', error);
    },
});

export const useRegister = ()=> useMutation({
    mutationFn:  register,
    onSuccess: (data) => {
        // Handle successful registration, e.g., store user data, redirect, etc.
        console.log('Registration successful:', data);
        setAuthenticated(true); // Update Zustand global state
    },
    onError: (error, data) => {
        console.log(data)
        // Handle registration error, e.g., show error message to user
        console.error('Registration error:', error);
    },
});
export const useLogout = ()=> useMutation({
    mutationFn:  logout,
    onSuccess: (data) => {
        // Handle successful registration, e.g., store user data, redirect, etc.
        console.log('Logout successfull:', data);
        setAuthenticated(false); // Update Zustand global state
    },
    onError: (error, data) => {
        console.log(data)
        // Handle registration error, e.g., show error message to user
        console.error('logout session error:', error);
    },
});