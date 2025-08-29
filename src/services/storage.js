import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveToken = async (token) => {
    try {
        await AsyncStorage.setItem('userToken', token);
        console.log('Token saved successfully:', token);
    } catch (error) {
        console.log('Error saving token:', error);
    }
};

export const saveUserId = async (userId) => {
    try {
        await AsyncStorage.setItem('userId', userId);
        console.log('User ID saved successfully:', userId);
    } catch (error) {
        console.log('Error saving user ID:', error);
    }
};

export const getToken = async () => {
    try {
        return await AsyncStorage.getItem('userToken');
    } catch (error) {
        console.log('Error getting token:', error);
        return null;
    }
};

export const getUserId = async () => {
    try {
        return await AsyncStorage.getItem('userId');
    } catch (error) {
        console.log('Error getting user ID:', error);
        return null;
    }
};
