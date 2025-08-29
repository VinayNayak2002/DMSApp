// src/services/authService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';

export const setToken = async (token) => {
    await AsyncStorage.setItem('API_TOKEN', token);
};

export const getToken = async () => {
    return await AsyncStorage.getItem('API_TOKEN');
};

// Get user_id from stored token
export const getUserIdFromToken = async () => {
    const token = await getToken();
    if (!token) return null;
    try {
        const decoded = jwtDecode(token);
        return decoded.user_name || decoded.user_id; // adapt to your token payload
    } catch (err) {
        console.error('Invalid token:', err);
        return null;
    }
};
