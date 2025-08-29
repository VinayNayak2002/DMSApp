import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveToken = async (token) => {
    try {
        await AsyncStorage.setItem('userToken', token);
        console.log('Token saved successfully:', token);
    } catch (error) {
        console.log('Error saving token:', error);
    }
};