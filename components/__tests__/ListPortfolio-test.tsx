import * as React from 'react';
import { render } from '@testing-library/react-native';
import { ListPortfolio } from '../ListPortfolio';

describe('ListPortfolio', () => {
  it('renders correctly', () => {
    const data = [
      {
        instrument_id: 1,
        ticker: 'AAPL',
        quantity: 10,
        avg_cost_price: 100,
        close_price: 120,
        last_price: 125,
      },
    ];
    const { getByText } = render(
      <ListPortfolio data={data} loading={false} onRefresh={jest.fn()} />
    );
    expect(getByText('AAPL')).toBeTruthy();
    expect(getByText('Cantidad: 10 acciones')).toBeTruthy();
    expect(getByText('Precio promedio: $100.00')).toBeTruthy();
    expect(getByText('Último: $125.00')).toBeTruthy();
  });

  it('shows loading indicator when loading and no data', () => {
    const { getByTestId } = render(
      <ListPortfolio data={[]} loading={true} onRefresh={jest.fn()} />
    );
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('calls onRefresh when refreshing', () => {
    const onRefresh = jest.fn();
    const { UNSAFE_getByProps } = render(
      <ListPortfolio data={[]} loading={false} onRefresh={onRefresh} />
    );
    const flatList = UNSAFE_getByProps({ onRefresh });
    flatList.props.onRefresh();
    expect(onRefresh).toHaveBeenCalled();
  });
});