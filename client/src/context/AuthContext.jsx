import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../apiConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Login failed');
        }

        const data = await response.json();
        if (data.token) {
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
            return { success: true };
        }
    };

    const register = async (name, email, password) => {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fullName: name,
                email,
                password,
                phoneNumber: '' // Placeholder for now
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Registration failed');
        }

        // Auto-login after registration
        return await login(email, password);
    };

    const logout = () => {
        localStorage.clear();
        sessionStorage.clear();
        setUser(null);
        // Using window.location.href to a new URL ensures a fresh start
        window.location.href = '/?logout=' + Date.now();
    };

    const refreshUser = async () => {
        if (!user || !user.token) return;
        try {
            const response = await fetch(`${API_BASE_URL}/users/me`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (response.ok) {
                const updatedUser = await response.json();
                const newUser = { ...user, ...updatedUser };
                localStorage.setItem('user', JSON.stringify(newUser));
                setUser(newUser);
            }
        } catch (error) {
            console.error("Failed to refresh user:", error);
        }
    };

    const googleLogin = async (token) => {
        const response = await fetch(`${API_BASE_URL}/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Google login failed');
        }

        const data = await response.json();
        if (data.token) {
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
            return data;
        }
    };

    const forgotPassword = async (email) => {
        const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Failed to send reset email');
        }

        return await response.text();
    };

    const resetPassword = async (email, otp, password) => {
        const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp, password })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Failed to reset password');
        }

        return await response.text();
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, googleLogin, forgotPassword, resetPassword, refreshUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
