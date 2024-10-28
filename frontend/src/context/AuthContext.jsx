import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('userId');
        if (storedToken) setToken(storedToken);
        if (storedUserId) setUserId(storedUserId);
    }, []);

    const login = (newToken, newUserId) => {
        setToken(newToken);
        setUserId(newUserId);
        localStorage.setItem('token', newToken);
        localStorage.setItem('userId', newUserId);
    };

    const logout = () => {
        setToken(null);
        setUserId(null);
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
    };

    return (
        <AuthContext.Provider value={{ token, userId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
