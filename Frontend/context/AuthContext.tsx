// context/AuthContext.js
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";

interface User {
    email: string;
    uid: string;
}
interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Sign in function
    const login = async (email, password) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    // Sign out function
    const logout = async () => {
        await signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);


// "use client";

// import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// interface User {
//   id: string;
//   email: string;
//   name: string;
// }

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Simulate checking for a logged-in user
//     const checkLoggedIn = () => {
//       const savedUser = localStorage.getItem("user");
//       if (savedUser) {
//         setUser(JSON.parse(savedUser));
//       }
//       setLoading(false);
//     };

//     // Add a small delay to simulate network request
//     setTimeout(checkLoggedIn, 500);
//   }, []);

//   const login = async (email: string, password: string) => {
//     // Simulate login API call
//     setLoading(true);
    
//     // For demo purposes, any email/password combination works
//     const mockUser = {
//       id: "user-123",
//       email,
//       name: "Demo User",
//     };
    
//     localStorage.setItem("user", JSON.stringify(mockUser));
//     setUser(mockUser);
//     setLoading(false);
//   };

//   const logout = async () => {
//     // Simulate logout
//     localStorage.removeItem("user");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// }