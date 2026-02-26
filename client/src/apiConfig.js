// Basic API Configuration
const isLocal = window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1');

// Base URL of the backend server
export const BASE_URL = isLocal
    ? `http://${window.location.hostname}:8083`
    : window.location.origin;

// API Base URL
export const API_BASE_URL = isLocal
    ? `${BASE_URL}/api`
    : `${window.location.origin}/api`;

// Helper for file URLs
export const getFileUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${BASE_URL}${cleanPath}`;
};
