"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { login, setAuthToken } from "./logConf"; // Chemin vers ton fichier API

interface AuthContextProps {
  user: string | null;
  token: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  verify: () => string | null; // Retourne directement le token si valide
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Indique si l'application vérifie encore le token

  const handleLogin = async (username: string, password: string) => {
      const data = await login(username, password);
      setUser(username);
      setToken(data.token);
      setAuthToken(data.token); // Configure le token pour Axios
      localStorage.setItem("token", data.token);
    
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setAuthToken(null);
    setTimeout(()=>{
      localStorage.removeItem("token");
    },0)
    
  };

  const handleVerifying = ():any => {
    setTimeout(() => {
      return localStorage.removeItem("token");
  }, 86400000);

    setIsLoading(false);
    return localStorage.getItem("token");
    
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login: handleLogin,
        logout: handleLogout,
        verify: handleVerifying,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};