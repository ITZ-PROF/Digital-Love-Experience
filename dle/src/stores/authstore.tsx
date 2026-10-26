import { create } from "zustand";
import { persist } from "zustand/middleware";

// 1. Define the complete shape of your store's state and actions
interface AuthInterface {
    authenticated: boolean;
    setAuthenticated: (value: boolean) => void; // Declare function signature
}

export const useAuth = create<AuthInterface>()(
    persist(
        (set) => ({
        authenticated: false,
        setAuthenticated: (value: boolean) => set(() => ({ authenticated: value }))
    }), {
        name: 'auth'
    })
    )
