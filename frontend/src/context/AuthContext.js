import { createContext, useContext, useState, useEffect } from "react";
import {toast} from "sonner";
import { BASE_URL } from "./Api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [fromAuthFlow, setFromAuthFlow] = useState(null);
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch(`${BASE_URL}/auth/check`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if(response.ok) {
                    const data = await response.json();
                    setIsAuthenticated(true);
                    setUser(data.user);
                } else {
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } catch (err) {
                setIsAuthenticated(false);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = (userData) => {
        setIsAuthenticated(true);
        setUser(userData);
    };
    const logout = async () => {
        try {
            const response = await fetch(`${BASE_URL}/auth/signout`, {
                method: 'POST',
                credentials: 'include'
            });

            if(response.ok) {
                setIsAuthenticated(false);
                setUser(null);
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            user,
            login,
            logout,
            isLoading,
            fromAuthFlow,
            setFromAuthFlow,
        }}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);