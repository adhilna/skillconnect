import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState('');

    // Initialize from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('access');
        if (storedUser) setUser(JSON.parse(storedUser));
        if (storedToken) setToken(storedToken);
    }, []);

    const login = (userData, receivedToken, refreshToken) => {
        setUser(userData);
        setToken(receivedToken);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('access', receivedToken);
        localStorage.setItem('refresh', refreshToken);
        return userData;
    };

    const logout = () => {
        setUser(null);
        setToken('');
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};
