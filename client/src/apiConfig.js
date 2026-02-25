// Basic API Configuration
export const API_BASE_URL = window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1') || window.location.hostname.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)
    ? `http://${window.location.hostname}:8083/api`
    : "/api";
