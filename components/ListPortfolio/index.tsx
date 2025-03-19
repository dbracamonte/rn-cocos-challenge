import React from 'react';
import {
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { IPortfolio } from '@/services/portfolioService';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';

interface IPortfoliosListProps {
  data: IPortfolio[];
  loading: boolean;
  onRefresh: () => void;
}

export const ListPortfolio = ({ data, loading, onRefresh }: IPortfoliosListProps) => {
  const renderItem = ({ item }: { item: IPortfolio }) => {
    const marketValue = item.quantity * item.last_price;
    const costValue = item.quantity * item.avg_cost_price;
    const absoluteGain = marketValue - costValue;
    const percentageReturn = costValue > 0
      ? ((marketValue - costValue) / costValue) * 100
      : 0;

    const isGainPositive = absoluteGain >= 0;
    const isReturnPositive = percentageReturn >= 0;

    return (
      <ThemedView style={styles.card}>

        <ThemedView style={styles.row}>
          <ThemedText type='subtitle'>
            {item.ticker}
          </ThemedText>
          <ThemedText type='subtitle'>
            ${marketValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </ThemedText>
        </ThemedView>

        <ThemedText>Cantidad: {item.quantity} acciones</ThemedText>

        <ThemedView style={styles.divider} />

        <ThemedView style={styles.row}>
          <ThemedText>
            Precio promedio: ${item.avg_cost_price.toFixed(2)}
          </ThemedText>
          <ThemedText>
            Último: ${item.last_price.toFixed(2)}
          </ThemedText>
        </ThemedView>

        <ThemedView style={[styles.row, { gap: 12 }]}>
          <ThemedView style={[styles.box, isGainPositive ? styles.positiveBackground : styles.negativeBackground]}>
            <ThemedText type='smallBold' style={isGainPositive ? styles.positiveText : styles.negativeText}>
              Ganancia:
            </ThemedText>
            <ThemedText type='small' style={isGainPositive ? styles.positiveText : styles.negativeText}>
              {isGainPositive ? '+' : ''}{absoluteGain.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </ThemedText>
          </ThemedView>
          <ThemedView style={[styles.box, isGainPositive ? styles.positiveBackground : styles.negativeBackground]}>
            <ThemedText type='smallBold' style={isGainPositive ? styles.positiveText : styles.negativeText}>
              Rendimiento:
            </ThemedText>
            <ThemedText type='small' style={isGainPositive ? styles.positiveText : styles.negativeText}>
              {isReturnPositive ? '+' : ''}{percentageReturn.toFixed(2)}%
            </ThemedText>
          </ThemedView>
        </ThemedView>

      </ThemedView>
    )
  }

  if (data.length === 0 && loading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#333" testID="loading-indicator" />
      </ThemedView>
    );
  }

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, ind) => `portfolio-${ind}-${item.instrument_id.toString()}`}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={onRefresh}
          tintColor="#333"
          testID="refresh-control"
        />
      }
      ItemSeparatorComponent={() => <ThemedView style={[styles.divider, { marginVertical: 8 }]} />}
      contentContainerStyle={{
        padding: 16,
        paddingBottom: Platform.OS == "ios" ? 48 + 16 : 16,
      }}
    />
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    padding: 16,
    gap: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  box: {
    flex: 1,
    borderRadius: 4,
    padding: 6,
    alignItems: 'center',
  },
  positiveText: {
    color: '#00aa00',
  },
  negativeText: {
    color: '#e53935',
  },
  positiveBackground: {
    backgroundColor: '#ebfaeb',
  },
  negativeBackground: {
    backgroundColor: '#ffebee',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
});