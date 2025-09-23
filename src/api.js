import axios from 'axios';

// Create a central axios instance
const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

// API calls
export const fetchModels = () => API.get('/data');
export const fetchBanks = (model) => API.get('/fetch-scheme', { params: { model } });
export const fetchTenures = (model, bank) => API.get('/fetch-scheme', { params: { model, bank } });
export const fetchScheme = (model, bank, tenure) =>
    API.get('/fetch-scheme', { params: { model, bank, tenure } });
export const updateDatabase = () => API.get('/update-db');
