import React from 'react';
import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('access') || '');

    const login = (data) => {
        return new Promise((resolve, reject) => {
            try {
                setUser({ email: data.email, role: data.role });
                setToken(localStorage.getItem('access') || '');
                resolve(data);
            } catch (error) {
                console.error('Login failed:', error.response?.data || error.message);
                reject(error);
            }
        });
    };

    const logout = () => {
        setToken('');
        setUser(null);
        localStorage.removeItem('access');
        localStorage.removeItem('refresh_token');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};