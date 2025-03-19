import * as React from 'react';
import { render } from '@testing-library/react-native';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';

describe('ThemedView', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(
      <ThemedView testID="themed-view">
        <ThemedText>Snapshot test!</ThemedText>
      </ThemedView>
    );
    const view = getByTestId('themed-view');
    expect(view).toBeTruthy();
  });

  it('renders correctly with custom style', () => {
    const { getByTestId } = render(
      <ThemedView testID="themed-view" style={{ backgroundColor: '#151718' }}>
        <ThemedText>Snapshot test!</ThemedText>
      </ThemedView>
    );
    const view = getByTestId('themed-view');
    expect(view).toHaveStyle({ backgroundColor: '#151718' });
  });
});
