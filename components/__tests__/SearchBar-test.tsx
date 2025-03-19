import * as React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SearchBar } from '../SearchBar';

jest.mock('@expo/vector-icons/Ionicons', () => {
  const { Text } = require('react-native');
  return () => <Text>MockedIcon</Text>;
});

describe('SearchBar', () => {
  it('renders correctly, with correct placeholder', () => {
    const { getByPlaceholderText } = render(
      <SearchBar value="" onChangeText={() => { }} />
    );
    const input = getByPlaceholderText('Search by ticker name');
    expect(input).toBeTruthy();
  });

  it('renders the correct icon', () => {
    const { getByText } = render(
      <SearchBar value="" onChangeText={() => { }} />
    );
    const icon = getByText('MockedIcon');
    expect(icon).toBeTruthy();
  });

  it('calls onChangeText with the correct value', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchBar value="" onChangeText={onChangeText} />
    );
    const input = getByPlaceholderText('Search by ticker name');
    fireEvent.changeText(input, 'AAPL');
    expect(onChangeText).toHaveBeenCalledWith('AAPL');
  });
});