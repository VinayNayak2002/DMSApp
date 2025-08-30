import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Text } from "react-native";

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import UploadScreen from '../screens/UploadScreen';
import SearchScreen from '../screens/SearchScreen';
import PreviewScreen from '../screens/PreviewScreen';
import { useAuth } from "../context/authContext";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const { logout } = useAuth();

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Login"
                screenOptions={{
                    headerStyle: { backgroundColor: "#2166e5" },
                    headerTintColor: "#fff",
                    headerTitleStyle: { fontWeight: "bold" },
                }}
            >
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={({ navigation }) => ({
                        headerRight: () => (
                            <TouchableOpacity
                                onPress={async () => {
                                    await logout();
                                    navigation.reset({
                                        index: 0,
                                        routes: [{ name: 'Login' }],
                                    });
                                }}
                                style={{ marginRight: 15 }}
                            >
                                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                                    Logout
                                </Text>
                            </TouchableOpacity>
                        ),
                    })}
                />
                <Stack.Screen name="Upload" component={UploadScreen} />
                <Stack.Screen name="Search" component={SearchScreen} />
                <Stack.Screen name="Preview" component={PreviewScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
