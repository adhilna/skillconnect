import { createContext, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || '');

    const login = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:8000/api/v1/auth/token/', {
                email,
                password,
            });
            const { access } = response.data;
            setToken(access);
            localStorage.setItem('token', access);
            setUser({ email });
        } catch (error) {
            console.error('Login failed:', error.response?.data);
            throw error;
        }
    };

    const logout = () => {
        setToken('');
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};