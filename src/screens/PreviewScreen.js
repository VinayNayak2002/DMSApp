import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Alert } from 'react-native';
import { WebView } from 'react-native-webview';

export default function PreviewScreen({ route }) {
  const { file } = route.params;

  if (!file) {
    return (
      <View style={styles.center}>
        <Text>No file to preview.</Text>
      </View>
    );
  }

  const fileName = file.file_name || '';
  const extension = fileName.split('.').pop().toLowerCase();

  if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: file.file_url }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    );
  }

  if (extension === 'pdf') {
    return (
      <WebView
        source={{ uri: file.file_url }}
        style={styles.pdf}
      />
    );
  }

  return (
    <View style={styles.center}>
      <Text>Preview not available for this file type.</Text>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width,
    height: height,
  },
  pdf: {
    flex: 1,
    width: width,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
