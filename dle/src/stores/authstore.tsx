import { create } from "zustand";

// 1. Define the complete shape of your store's state and actions
interface AuthInterface {
    authenticated: boolean;
    setAuthenticated: (value: boolean) => void; // Declare function signature
}

export const useAuth = create<AuthInterface>((set) => ({
    authenticated: false,
    
    setAuthenticated: (value: boolean) => set(() => ({ authenticated: value }))
}));
