import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import UploadScreen from '../screens/UploadScreen';
import SearchScreen from '../screens/SearchScreen';
import PreviewScreen from '../screens/PreviewScreen';


const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Upload" component={UploadScreen} />
                <Stack.Screen name="Search" component={SearchScreen} />
                <Stack.Screen name="Preview" component={PreviewScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
