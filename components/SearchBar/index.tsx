import React from 'react';
import {
  TextInput,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { ThemedView } from '../ThemedView';
import Ionicons from '@expo/vector-icons/Ionicons'

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export const SearchBar = ({ value, onChangeText }: SearchBarProps) => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <ThemedView style={[
      styles.container,
      { backgroundColor: isDarkMode ? '#1a1a1a' : '#fff' }
    ]}>
      <Ionicons color={isDarkMode ? '#666' : '#999'} size={20} name="search"/>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search by ticker name"
        placeholderTextColor={isDarkMode ? '#666' : '#999'}
        style={[
          styles.input,
          { color: isDarkMode ? '#fff' : '#000' }
        ]}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 6,
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
});