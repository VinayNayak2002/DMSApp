import { Alert } from 'react-native';

export const downloadFile = async (url, fileName = 'mock_file.pdf') => {
  try {
    console.log('URL:', url, 'File:', fileName);

    await new Promise((resolve) => setTimeout(resolve, 500));

    Alert.alert('Download Success', `Download feature is in development`);
    console.log('Success');
    return true;
  } catch (error) {
    console.error('[Error:', error);
    Alert.alert('Download Error', 'Failed to download mock file.');
    return false;
  }
};
