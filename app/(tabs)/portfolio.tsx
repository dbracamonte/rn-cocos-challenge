import { useEffect } from 'react';
import { StyleSheet, SafeAreaView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { usePortfoliosStore } from '@/stores/portfolio';
import { ListPortfolio } from '@/components/ListPortfolio';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function PortfolioScreen() {
  const isDarkMode = useColorScheme() === 'dark';

  const {
    portfolios,
    loading,
    error,
    fetchPortfolios,
  } = usePortfoliosStore();

  useEffect(() => {
    fetchPortfolios();
  }, [fetchPortfolios]);

  if (error) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText type="error">
          {error}
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <ListPortfolio
        data={portfolios}
        loading={loading}
        onRefresh={fetchPortfolios}
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
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    opacity: 0.1,
  },
});
