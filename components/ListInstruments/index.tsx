import React from 'react';
import {
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Link } from 'expo-router';

import { IInstrument } from '@/services/instrumentsService';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';

interface IInstrumentsListProps {
  data: IInstrument[];
  loading: boolean;
  onRefresh: () => void;
}

export const ListInstruments = ({ data, loading, onRefresh }: IInstrumentsListProps) => {
  const renderItem = ({ item }: { item: IInstrument }) => (
    <Link href={`/modal?instrumentId=${item.id}`} disabled={loading}>
      <ThemedView style={styles.card}>

        <ThemedView style={styles.content}>
          <ThemedView style={styles.info}>
            <ThemedText type='subtitle'>
              {item.ticker}
            </ThemedText>
            <ThemedText>
              {item.name}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.priceInfo}>
          <ThemedText type='defaultSemiBold'>
            ${item.last_price.toFixed(2)}
          </ThemedText>
          <ThemedText type='smallBold' style={(item.return_percentage ?? 0) > 0 ? styles.positive : styles.negative}>
            {(item.return_percentage ?? 0).toFixed(2)}%
          </ThemedText>
        </ThemedView>

      </ThemedView>
    </Link>
  );

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
      keyExtractor={(item, ind) => `instrument-${ind}-${item.id.toString()}`}
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
        paddingHorizontal: 16,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  positive: {
    color: '#00c853',
  },
  negative: {
    color: '#ff1744',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
});