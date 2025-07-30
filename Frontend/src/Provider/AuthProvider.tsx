import { AuthContext, AuthContextType } from '@/context/AuthContext';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { User } from '@/Utils/User';
import axios from 'axios';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("userInfo");
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  //Login function to check username and password
  const login: AuthContextType["login"] = async (username, password) => {

    try {
      const response = await axios.post("http://localhost:3000/users/sign-in", {
        email: username,
        password: password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const rs = response.data as { status: boolean, message?: string, user?: User };
      
      if (rs.status && rs.user) {
        setUser(rs.user);
        localStorage.setItem("userInfo", JSON.stringify(rs.user));
      }
      return rs.status;
    } catch (error) {
      return false;
    }
  };

  //Logout function to check username and password
  const logout: AuthContextType["logout"] = () => {
    setUser(null);
    localStorage.removeItem("userInfo");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}


