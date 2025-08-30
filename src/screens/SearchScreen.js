import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { fetchTags } from '../services/tagService';
import { downloadFile } from '../services/downloadService';
import { useAuth } from '../context/authContext';
import { searchDocuments } from '../services/searchService';

export default function SearchScreen({ navigation }) {
  // Filters
  const [majorHead, setMajorHead] = useState('');
  const [minorHead, setMinorHead] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  // Options 
  const majorOptions = ['Personal', 'Professional'];
  const personalOptions = ['John', 'Tom', 'Emily'];
  const professionalOptions = ['Accounts', 'HR', 'IT', 'Finance'];

  const minorOptions = useMemo(() => {
    if (majorHead === 'Personal') return personalOptions;
    if (majorHead === 'Professional') return professionalOptions;
    return [];
  }, [majorHead]);

  // Tags
  const [allTags, setAllTags] = useState([]);
  const [filteredTags, setFilteredTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  // UI State
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const { token, userId } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        if (!token) return;
        const tags = await fetchTags(token);
        setAllTags(tags || []);
      } catch (e) {
        console.log(e);
      }
    };
    load();
  }, [token]);


  useEffect(() => {
    const q = tagInput.trim().toLowerCase();
    if (!q) {
      setFilteredTags([]);
      return;
    }
    setFilteredTags(
      allTags.filter((t) => t.toLowerCase().includes(q)).slice(0, 10)
    );
  }, [tagInput, allTags]);

  const addTag = (tagFromSuggestion) => {
    const tag = (tagFromSuggestion || tagInput).trim();
    if (!tag) return;
    if (!selectedTags.includes(tag)) {
      setSelectedTags((prev) => [...prev, tag]);
    }
    setTagInput('');
    setFilteredTags([]);
  };

  const clearFilters = () => {
    setMajorHead('');
    setMinorHead('');
    setFromDate(null);
    setToDate(null);
    setSelectedTags([]);
    setTagInput('');
    setFilteredTags([]);
  };

  const handleSearch = async () => {
    if (!token) {
      console.error('Authentication token not found.');
      return;
    }

    try {
      setLoading(true);

      const response = await searchDocuments({ token, userId })({
        majorHead,
        minorHead,
        fromDate,
        toDate,
        tags: selectedTags,
        start: 0,
        length: 20,
        searchValue: '',
        uploadedBy: '',
        filterId: ''
      });

      console.log('Search response received:', response);

      if (response?.status && Array.isArray(response.data)) {
        setResults(response.data);
      } else {
        setResults([]);
        console.log('Search returned no results or failed.');
      }
    } catch (e) {
      console.error('Search failed:', e);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };



  const handleDownload = async (item) => {
    try {
      if (!item.file_url) {
        Alert.alert('Error', 'No file URL available for download.');
        return;
      }
      const name = item.file_name || 'document.pdf';
      await downloadFile(item.file_url, name);
    } catch (error) {
      console.error('Download failed:', error);
      Alert.alert('Error', 'Failed to download file.');
    }
  };


  const renderHeader = () => (
    <View>
      <Text style={styles.title}>Search Documents</Text>

      {/* Major Head */}
      <View style={styles.section}>
        <Text style={styles.label}>Major Head</Text>
        <View style={styles.rowWrap}>
          {majorOptions.map((opt) => {
            const selected = majorHead === opt;
            return (
              <TouchableOpacity
                key={opt}
                style={[styles.chip, selected && styles.chipSelected]}
                onPress={() => {
                  setMajorHead(opt);
                  setMinorHead('');
                }}
              >
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                  {opt}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Minor Head */}
      <View style={styles.section}>
        <Text style={styles.label}>Minor Head</Text>
        <View style={styles.rowWrap}>
          {minorOptions.map((opt) => {
            const selected = minorHead === opt;
            return (
              <TouchableOpacity
                key={opt}
                style={[styles.chip, selected && styles.chipSelected]}
                onPress={() => setMinorHead(opt)}
              >
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                  {opt}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Tags */}
      <View style={styles.section}>
        <Text style={styles.label}>Tags</Text>
        <View style={styles.tagRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Enter or search tag"
            value={tagInput}
            onChangeText={setTagInput}
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.addBtn} onPress={() => addTag()}>
            <Text style={styles.btnText}>Add</Text>
          </TouchableOpacity>
        </View>

        {filteredTags.length > 0 && (
          <View style={styles.suggestionBox}>
            {filteredTags.map((t) => (
              <TouchableOpacity key={t} style={styles.suggestionItem} onPress={() => addTag(t)}>
                <Text>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.tagsContainer}>
          {selectedTags.map((t) => (
            <View key={t} style={styles.tagPill}>
              <Text style={styles.tagPillText}>{t}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Dates */}
      <View style={styles.section}>
        <Text style={styles.label}>From Date</Text>
        <TouchableOpacity
          style={styles.dateBtn}
          onPress={() => setShowFromPicker(true)}
        >
          <Text style={styles.dateBtnText}>
            {fromDate ? fromDate.toDateString() : 'Select from date'}
          </Text>
        </TouchableOpacity>
        {showFromPicker && (
          <DateTimePicker
            value={fromDate || new Date()}
            mode="date"
            display="default"
            onChange={(e, d) => {
              if (Platform.OS === 'android') setShowFromPicker(false);
              if (d) setFromDate(d);
            }}
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>To Date</Text>
        <TouchableOpacity
          style={styles.dateBtn}
          onPress={() => setShowToPicker(true)}
        >
          <Text style={styles.dateBtnText}>
            {toDate ? toDate.toDateString() : 'Select to date'}
          </Text>
        </TouchableOpacity>
        {showToPicker && (
          <DateTimePicker
            value={toDate || new Date()}
            mode="date"
            display="default"
            onChange={(e, d) => {
              if (Platform.OS === 'android') setShowToPicker(false);
              if (d) setToDate(d);
            }}
          />
        )}
      </View>

      {/* Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={[styles.btn, styles.primaryBtn]} onPress={handleSearch} disabled={loading}>
          <Text style={styles.primaryBtnText}>{loading ? 'Searching...' : 'Search'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.secondaryBtn]} onPress={clearFilters} disabled={loading}>
          <Text style={styles.secondaryBtnText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />
    </View>
  );

  return (
    <FlatList
      data={results}
      keyExtractor={(item, index) => String(item.id || index)}
      ListHeaderComponent={renderHeader}
      renderItem={({ item }) => (
        <View style={styles.resultItem}>
          <Text style={styles.resultTitle}>{item.file_name || 'No Name'}</Text>
          <Text>Major: {item.major_head}</Text>
          <Text>Minor: {item.minor_head}</Text>
          <Text>Tags: {Array.isArray(item.tags) ? item.tags.map((t) => t.tag_name).join(', ') : ''}</Text>
          <Text>Date: {item.document_date}</Text>

          <View style={{ flexDirection: 'row', marginTop: 8, gap: 8 }}>
            <TouchableOpacity
              style={[styles.btn, styles.primaryBtn, { flex: 1 }]}
              onPress={() => {
                const file = {
                  file_url: item.file_url,
                  file_name: item.file_name || 'document',
                  mime_type: item.mime_type || 'application/pdf',
                };
                navigation.navigate('Preview', { file });
              }}
            >
              <Text style={styles.primaryBtnText}>Preview</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.secondaryBtn, { flex: 1 }]}
              onPress={() => handleDownload(item)}
            >
              <Text style={styles.secondaryBtnText}>Download</Text>
            </TouchableOpacity>
          </View>

        </View>
      )}
      contentContainerStyle={styles.container}
      ListEmptyComponent={
        <Text style={styles.emptyText}>
          {loading ? '' : 'No results to display.'}
        </Text>
      }
      removeClippedSubviews
      initialNumToRender={10}
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12, color: '#222' },
  section: { marginBottom: 16 },
  label: { fontSize: 14, marginBottom: 8, fontWeight: '600', color: '#333' },

  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#c7c7c7',
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  chipSelected: {
    borderColor: '#2166e5',
    backgroundColor: '#e7f0ff',
  },
  chipText: { color: '#333' },
  chipTextSelected: { color: '#1a4fb0', fontWeight: '700' },

  input: {
    borderWidth: 1,
    borderColor: '#c7c7c7',
    padding: 10,
    borderRadius: 8,
  },

  tagRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  addBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#2166e5',
  },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: '600' },

  primaryBtn: { backgroundColor: '#2166e5' },
  primaryBtnText: { color: '#fff', fontWeight: '700' },
  secondaryBtn: { backgroundColor: '#ededed' },
  secondaryBtnText: { color: '#333', fontWeight: '700' },

  dateBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2166e5',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  dateBtnText: {
    color: '#2166e5',
    fontWeight: '600',
  },

  suggestionBox: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    marginTop: 6,
    overflow: 'hidden',
  },
  suggestionItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },

  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  tagPill: {
    backgroundColor: '#eee',
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 6,
    marginBottom: 6,
    borderRadius: 12,
  },
  tagPillText: { fontSize: 12, color: '#333' },

  actionsRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  divider: { height: 1, backgroundColor: '#e9e9e9', marginVertical: 16 },

  resultItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#e9e9e9',
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  resultTitle: { fontWeight: '700', marginBottom: 4, color: '#222' },
  emptyText: { textAlign: 'center', color: '#777', paddingVertical: 24 },
});
