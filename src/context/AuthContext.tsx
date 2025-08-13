import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { type User, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

// Define the shape of the context state
interface AuthContextType {
    user: User | null;
    loading: boolean;
}

// Create the context with default empty values
const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Subscribe to Firebase auth state changes
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    // Provide user and loading state in the context
    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to access auth context easily
export const useAuth = () => useContext(AuthContext);
