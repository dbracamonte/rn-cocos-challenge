import * as React from 'react';
import { render } from '@testing-library/react-native';
import { ListInstruments } from '../ListInstruments';

describe('ListInstruments', () => {
  it('renders correctly', () => {
    const data = [
      {
        id: 1,
        ticker: 'AAPL',
        name: 'Apple Inc.',
        type: 'Stock',
        close_price: 124,
        last_price: 125,
        return_percentage: 0.5,
      },
    ];
    const { getByText } = render(
      <ListInstruments data={data} loading={false} onRefresh={jest.fn()} />
    );
    expect(getByText('AAPL')).toBeTruthy();
    expect(getByText('Apple Inc.')).toBeTruthy();
    expect(getByText('$125.00')).toBeTruthy();
    expect(getByText('0.50%')).toBeTruthy();
  });

  it('shows loading indicator when loading and no data', () => {
    const { getByTestId } = render(
      <ListInstruments data={[]} loading={true} onRefresh={jest.fn()} />
    );
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('calls onRefresh when refreshing', () => {
    const onRefresh = jest.fn();
    const { UNSAFE_getByProps } = render(
      <ListInstruments data={[]} loading={false} onRefresh={onRefresh} />
    );
    const flatList = UNSAFE_getByProps({ onRefresh });
    flatList.props.onRefresh();
    expect(onRefresh).toHaveBeenCalled();
  });
});