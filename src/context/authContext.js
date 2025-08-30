import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuth = async () => {
      try {
        const savedToken = await AsyncStorage.getItem('userToken');
        const savedUserId = await AsyncStorage.getItem('userId');
        if (savedToken) setToken(savedToken);
        if (savedUserId) setUserId(savedUserId);
      } catch (e) {
        console.log('Error loading auth state', e);
      } finally {
        setLoading(false);
      }
    };
    loadAuth();
  }, []);

  const login = async (newToken, newUserId) => {
    setToken(newToken);
    setUserId(newUserId);
    await AsyncStorage.setItem('userToken', newToken);
    if (newUserId) await AsyncStorage.setItem('userId', newUserId.toString());
  };

  const logout = async () => {
    setToken(null);
    setUserId(null);
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userId');
  };

  return (
    <AuthContext.Provider value={{ token, userId, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
