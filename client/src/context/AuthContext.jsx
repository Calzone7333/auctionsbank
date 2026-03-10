import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { API_BASE_URL } from '../apiConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const idleTimerRef = useRef(null);
    const IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

    const logout = useCallback(() => {
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        sessionStorage.clear();
        localStorage.removeItem('user'); // Also clear any old localStorage data
        setUser(null);
        // Using window.location.href to home with a logout flag
        window.location.href = '/?session=expired';
    }, []);

    // Function to reset the idle timer
    const resetIdleTimer = useCallback(() => {
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        if (user) {
            idleTimerRef.current = setTimeout(() => {
                console.log("Session expired due to inactivity");
                logout();
            }, IDLE_TIMEOUT);
        }
    }, [user, logout]);

    useEffect(() => {
        // Try to load user from sessionStorage (tab session) or localStorage (persistent)
        const storedUser = sessionStorage.getItem('user') || localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            // Check if token exists
            if (parsedUser.token) {
                setUser(parsedUser);
            } else {
                sessionStorage.clear();
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    // Set up activity listeners for idle timeout
    useEffect(() => {
        if (user) {
            const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
            
            // Initial timer set
            resetIdleTimer();

            // Add listeners
            events.forEach(event => {
                window.addEventListener(event, resetIdleTimer);
            });

            return () => {
                if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
                events.forEach(event => {
                    window.removeEventListener(event, resetIdleTimer);
                });
            };
        }
    }, [user, resetIdleTimer]);

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
            // Using sessionStorage to ensure logout when browser/tab is closed
            sessionStorage.setItem('user', JSON.stringify(data));
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

    const refreshUser = async () => {
        if (!user || !user.token) return;
        try {
            const response = await fetch(`${API_BASE_URL}/users/me`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (response.ok) {
                const updatedUser = await response.json();
                const newUser = { ...user, ...updatedUser };
                sessionStorage.setItem('user', JSON.stringify(newUser));
                setUser(newUser);
            } else if (response.status === 401) {
                logout();
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
            sessionStorage.setItem('user', JSON.stringify(data));
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
