// src/screens/UploadScreen.js
import React, { useState, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, ScrollView, FlatList, Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { fetchTags } from '../services/tagService';
import { uploadDocument } from '../services/uploadService';
import { useNavigation } from '@react-navigation/native';

export default function UploadScreen() {
    const [documentDate, setDocumentDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [majorHead, setMajorHead] = useState('');
    const [minorHead, setMinorHead] = useState('');
    const [minorOptions, setMinorOptions] = useState([]);

    const [allTags, setAllTags] = useState([]);
    const [filteredTags, setFilteredTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [newTag, setNewTag] = useState('');

    const [remarks, setRemarks] = useState('');
    const [file, setFile] = useState(null);

    const majorOptions = ['Personal', 'Professional'];
    const personalOptions = ['John', 'Tom', 'Emily'];
    const professionalOptions = ['Accounts', 'HR', 'IT', 'Finance'];

    const navigation = useNavigation();

    useEffect(() => {
        const loadTags = async () => {
            try {
                const tagsFromAPI = await fetchTags();
                setAllTags(tagsFromAPI || []);
            } catch (err) {
                console.error('Error fetching tags:', err);
            }
        };
        loadTags();
    }, []);

    useEffect(() => {
        if (majorHead === 'Personal') setMinorOptions(personalOptions);
        else if (majorHead === 'Professional') setMinorOptions(professionalOptions);
        else setMinorOptions([]);
    }, [majorHead]);

    const handleDateChange = (event, selectedDate) => {
        if (Platform.OS === 'android') setShowDatePicker(false);
        if (selectedDate) setDocumentDate(selectedDate);
    };

    const handleTagInputChange = (text) => {
        setNewTag(text);
        if (text.trim().length > 0) {
            const matches = allTags.filter(tag =>
                tag.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredTags(matches);
        } else setFilteredTags([]);
    };

    const handleAddTag = (tagToAdd = null) => {
        const tag = (tagToAdd || newTag).trim();
        if (tag && !selectedTags.includes(tag)) {
            setSelectedTags([...selectedTags, tag]);
        }
        setNewTag('');
        setFilteredTags([]);
    };

    // File picker with type restrictions
    const handleFileUpload = () => {
        Alert.alert('Select File Source', '', [
            { text: 'Camera', onPress: openCamera },
            { text: 'Gallery', onPress: openGallery },
            { text: 'Cancel', style: 'cancel' },
        ]);
    };

    const openCamera = async () => {
        const result = await launchCamera({ mediaType: 'photo', saveToPhotos: true });
        if (result.assets && result.assets.length > 0) setFile(result.assets[0]);
    };

    const openGallery = async () => {
        const result = await launchImageLibrary({ mediaType: 'mixed' });
        if (result.assets && result.assets.length > 0) {
            const pickedFile = result.assets[0];
            if (pickedFile.type.startsWith('image/') || pickedFile.type === 'application/pdf') {
                setFile(pickedFile);
            } else {
                Alert.alert('Invalid File', 'Please select an image or PDF only.');
            }
        }
    };

    const handleSubmit = async () => {
        if (!majorHead || !minorHead || !file) {
            Alert.alert('Incomplete', 'Please select category, subcategory, and file.');
            return;
        }

        try {
            const result = await uploadDocument({
                documentDate,
                majorHead,
                minorHead,
                selectedTags,
                remarks,
                file,
            });

            if (result.status) {
                Alert.alert('Success', 'File uploaded successfully');

                // Reset form
                setDocumentDate(new Date());
                setMajorHead('');
                setMinorHead('');
                setSelectedTags([]);
                setRemarks('');
                setFile(null);
                setNewTag('');
                setFilteredTags([]);

                // Navigate back to Home
                navigation.navigate('Home');
            } else {
                Alert.alert('Upload Failed', result.message || 'Unknown error');
            }

            console.log('Upload response:', result);
        } catch (err) {
            console.error('Upload failed:', err);
            Alert.alert('Error', 'Failed to upload file');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Upload Document</Text>

            {/* Document Date */}
            <View style={styles.section}>
                <Text style={styles.label}>Document Date</Text>
                <TouchableOpacity style={styles.button} onPress={() => setShowDatePicker(true)}>
                    <Text style={styles.buttonText}>{documentDate.toDateString()}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={documentDate}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}
            </View>

            {/* Major Head */}
            <View style={styles.section}>
                <Text style={styles.label}>Category (Major Head)</Text>
                {majorOptions.map(option => (
                    <TouchableOpacity
                        key={option}
                        style={[styles.optionButton, majorHead === option && styles.optionButtonSelected]}
                        onPress={() => setMajorHead(option)}
                    >
                        <Text style={[styles.optionText, majorHead === option && styles.optionTextSelected]}>
                            {option}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Minor Head */}
            <View style={styles.section}>
                <Text style={styles.label}>Subcategory (Minor Head)</Text>
                {minorOptions.map(option => (
                    <TouchableOpacity
                        key={option}
                        style={[styles.optionButton, minorHead === option && styles.optionButtonSelected]}
                        onPress={() => setMinorHead(option)}
                    >
                        <Text style={[styles.optionText, minorHead === option && styles.optionTextSelected]}>
                            {option}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Tags */}
            <View style={styles.section}>
                <Text style={styles.label}>Tags</Text>
                <View style={styles.tagRow}>
                    <TextInput
                        style={[styles.input, { flex: 1 }]}
                        placeholder="Enter or select tag"
                        value={newTag}
                        onChangeText={handleTagInputChange}
                    />
                    <TouchableOpacity style={styles.addButton} onPress={() => handleAddTag()}>
                        <Text style={styles.buttonText}>Add</Text>
                    </TouchableOpacity>
                </View>

                {filteredTags.length > 0 && (
                    <FlatList
                        data={filteredTags}
                        keyExtractor={(item, index) => `${item}-${index}`}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.suggestionItem} onPress={() => handleAddTag(item)}>
                                <Text>{item}</Text>
                            </TouchableOpacity>
                        )}
                    />
                )}

                <View style={styles.tagContainer}>
                    {selectedTags.map(tag => (
                        <View key={tag} style={styles.tag}>
                            <Text style={styles.tagText}>{tag}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Remarks */}
            <View style={styles.section}>
                <Text style={styles.label}>Remarks</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter remarks"
                    value={remarks}
                    onChangeText={setRemarks}
                />
            </View>

            {/* File Upload */}
            <View style={styles.section}>
                <Text style={styles.label}>Upload File</Text>
                <TouchableOpacity style={styles.button} onPress={handleFileUpload}>
                    <Text style={styles.buttonText}>{file ? file.name || file.uri : 'Choose File'}</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
    section: { marginBottom: 20 },
    label: { fontSize: 16, marginBottom: 8, fontWeight: '500' },
    button: { backgroundColor: '#4CAF50', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, alignItems: 'center' },
    buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
    optionButton: { padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#aaa', marginVertical: 4 },
    optionButtonSelected: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
    optionText: { textAlign: 'center', color: '#333' },
    optionTextSelected: { color: '#fff', fontWeight: '600' },
    tagRow: { flexDirection: 'row', alignItems: 'center' },
    addButton: { backgroundColor: '#2196F3', padding: 10, marginLeft: 8, borderRadius: 8 },
    tagContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
    tag: { backgroundColor: '#eee', paddingHorizontal: 10, paddingVertical: 5, margin: 4, borderRadius: 8 },
    tagText: { fontSize: 14, color: '#333' },
    input: { borderWidth: 1, borderColor: '#aaa', padding: 10, borderRadius: 8 },
    submitButton: { backgroundColor: '#FF5722', paddingVertical: 14, alignItems: 'center', borderRadius: 8 },
    submitButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
    suggestionItem: { padding: 10, backgroundColor: '#f9f9f9', borderBottomWidth: 1, borderColor: '#ddd' },
});
