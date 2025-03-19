import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, View, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useInstrumentsStore } from '@/stores/instruments';
import { ListInstruments } from '@/components/ListInstruments';
import { SearchBar } from '@/components/SearchBar';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { debounce } from '@/utils/debounce';

export default function InstrumentsScreen() {
  const isDarkMode = useColorScheme() === 'dark';
  const [searchQuery, setSearchQuery] = useState('');

  const {
    instruments,
    searchResults,
    loading,
    error,
    fetchInstruments,
    searchInstruments,
  } = useInstrumentsStore();

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      searchInstruments(query);
    }, 500),
    [searchInstruments]
  );

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    debouncedSearch(text);
  };

  useEffect(() => {
    fetchInstruments();
  }, [fetchInstruments]);

  if (error) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText type="error">
          {error}
        </ThemedText>
      </ThemedView>
    );
  }

  const displayData = searchQuery.trim() ? searchResults : instruments;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <View style={styles.header}>
        <SearchBar
          value={searchQuery}
          onChangeText={handleSearchChange}
        />
      </View>
      <ListInstruments
        data={displayData}
        loading={loading}
        onRefresh={searchQuery.trim() ? () => searchInstruments(searchQuery) : fetchInstruments}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS == "android" ? 18 : 0,
    paddingBottom: Platform.OS == "ios" ? 32 : 0,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
