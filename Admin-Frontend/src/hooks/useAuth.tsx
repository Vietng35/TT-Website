import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";

export function useAuth()
{
    const auth = useContext(AuthContext);
    if (!auth) {
      throw new Error("useAuth must be used within an AuthProvider");
    }

    return auth;
}