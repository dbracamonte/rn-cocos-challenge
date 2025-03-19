import * as React from 'react';
import { render } from '@testing-library/react-native';
import { ThemedText } from '../ThemedText';

describe('ThemedText', () => {
  it('renders correctly', () => {
    const { getByText } = render(<ThemedText>Snapshot test!</ThemedText>);
    const text = getByText('Snapshot test!');
    expect(text).toBeTruthy();
  });

  it('renders correctly with custom style', () => {
    const { getByText } = render(
      <ThemedText style={{ color: '#333' }}>Snapshot test!</ThemedText>
    );
    const text = getByText('Snapshot test!');
    expect(text).toHaveStyle({ color: '#333' });
  });
});
