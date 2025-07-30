import { User } from "@/Utils/User";
import { createContext } from "react";

export interface AuthContextType {
    user: User | null; //Current user
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
