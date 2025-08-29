import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  return (
    <View>
      <Text>App</Text>
      <AppNavigator />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({});
