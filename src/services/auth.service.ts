import {api} from "../utils/request";
import {logintypes, signuptypes, logouttypes, loginPayload} from "../types/types";
import { data } from "react-router-dom";






const login = async (credentials : loginPayload) : Promise<logintypes> => {
    try {
        const response = await api.post('/auth/login', credentials);
        return response.data; // Assuming the API returns user data on successful login
    } catch (error) {
        console.log('Login failed:', error);
        throw error; // Rethrow the error to be handled by the caller
    }
};

const register = async (credentials: signuptypes) : Promise<signuptypes> => {
    try {
        const response = await api.post('/auth/register', credentials );
        return response.data; // Assuming the API returns user data on successful registration
    } catch (error) {
        console.error('Registration failed:', error);
        throw error; // Rethrow the error to be handled by the caller
    }
};
const logout = async () : Promise<logouttypes> => {
    try {
        const response = await api.post('/auth/logout' );
        return response.data; // Assuming the API returns user data on successful registration
    } catch (error) {
        console.error('logout session failed:', error);
        throw error; // Rethrow the error to be handled by the caller
    }
};

export { login, register, logout };