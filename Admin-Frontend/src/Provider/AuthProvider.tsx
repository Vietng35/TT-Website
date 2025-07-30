import { AuthContext, AuthContextType } from '@/context/AuthContext';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { User } from '@/utils/User';
import { useMutation } from "@apollo/client";
import { ADMIN_LOGIN } from "@/services/api";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [adLogin] = useMutation(ADMIN_LOGIN);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("userInfo");
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const login: AuthContextType["login"] = async (username, password) => {
    try {
      const res = await adLogin({ variables: { email: username, password } });

      if (res.data?.adminLogin?.token) {
        const user = {
          email: username,
          token: res.data.adminLogin.token
        };
        setUser(user);

        localStorage.setItem("userInfo", JSON.stringify(user));
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  };

  const logout: AuthContextType["logout"] = async () => {
    try {
      setUser(null);
      localStorage.removeItem("userInfo");
      router.push("/loginForAdmin");
    } catch (err) {

    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}


