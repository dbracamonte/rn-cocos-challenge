import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ApiService } from '@/services/apiService';
import { useInstrumentsStore } from '@/stores/instruments';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme.web';

type OperationType = 'BUY' | 'SELL';
type OrderType = 'MARKET' | 'LIMIT';

interface OrderFormData {
  operation: OperationType;
  type: OrderType;
  quantity: string;
  price?: string;
  useAmountInstead: boolean;
  totalAmount?: string;
}

interface OrderResponse {
  id: number;
  status: 'PENDING' | 'REJECTED' | 'FILLED';
}

export default function ModalScreen() {
  const theme = useColorScheme();
  const { instrumentId } = useLocalSearchParams();
  const id = typeof instrumentId === 'string' ? parseInt(instrumentId, 10) : 0;

  const [orderResult, setOrderResult] = useState<OrderResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { instruments } = useInstrumentsStore();
  const selectedInstrument = instruments.find(instrument => instrument.id === id);

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<OrderFormData>({
    defaultValues: {
      operation: 'BUY',
      type: 'MARKET',
      quantity: '',
      price: '',
      useAmountInstead: false,
      totalAmount: ''
    }
  });

  const orderType = watch('type');
  const useAmountInstead = watch('useAmountInstead');

  const calculateQuantity = () => {
    const totalAmount = parseFloat(watch('totalAmount') || '0');
    const lastPrice = selectedInstrument?.last_price || 0;

    if (totalAmount && lastPrice) {
      const maxQuantity = Math.floor(totalAmount / lastPrice);
      setValue('quantity', maxQuantity.toString());
    }
  };

  const onSubmit = async (data: OrderFormData) => {
    if (!selectedInstrument) return;

    try {
      setIsSubmitting(true);

      const orderData = {
        instrument_id: id,
        operation: data.operation,
        type: data.type,
        quantity: parseInt(data.quantity),
        ...(data.type === 'LIMIT' && { price: parseFloat(data.price || '0') })
      };

      const result = await ApiService.post<OrderResponse>('/orders', orderData);
      setOrderResult(result);
    } catch (error) {
      console.error('Error submitting order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderOrderForm = () => (
    <ScrollView>
      <ThemedView style={styles.container}>

        {selectedInstrument && (
          <ThemedView style={styles.instrumentInfo}>
            <ThemedText type='subtitle'>{selectedInstrument.ticker}</ThemedText>
            <ThemedText type='defaultSemiBold'>{selectedInstrument.name}</ThemedText>
            <ThemedText>Último precio: ${selectedInstrument.last_price.toFixed(2)}</ThemedText>
          </ThemedView>
        )}

        <ThemedView style={styles.formGroup}>
          <ThemedText type='defaultSemiBold'>Tipo de operación</ThemedText>
          <ThemedView style={styles.buttonGroup}>
            <Controller
              control={control}
              name="operation"
              rules={{ required: 'Selecciona el tipo de operación' }}
              render={({ field: { value, onChange } }) => (
                <>
                  <TouchableOpacity
                    style={[styles.button, value === 'BUY' && {
                      backgroundColor: theme === 'light' ? Colors.light.tabIconSelected : Colors.dark.tabIconSelected,
                    }]}
                    onPress={() => onChange('BUY')}
                  >
                    <ThemedText style={value === 'BUY' && {
                      color: theme === 'light' ? Colors.dark.tabIconSelected : Colors.light.tabIconSelected,
                    }}>Compra</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, value === 'SELL' && {
                      backgroundColor: theme === 'light' ? Colors.light.tabIconSelected : Colors.dark.tabIconSelected,
                    }]}
                    onPress={() => onChange('SELL')}
                  >
                    <ThemedText style={value === 'SELL' && {
                      color: theme === 'light' ? Colors.dark.tabIconSelected : Colors.light.tabIconSelected,
                    }}>Venta</ThemedText>
                  </TouchableOpacity>
                </>
              )}
            />
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.formGroup}>
          <ThemedText type='defaultSemiBold'>Tipo de orden</ThemedText>
          <ThemedView style={styles.buttonGroup}>
            <Controller
              control={control}
              name="type"
              rules={{ required: 'Selecciona el tipo de orden' }}
              render={({ field: { value, onChange } }) => (
                <>
                  <TouchableOpacity
                    style={[styles.button, value === 'MARKET' && {
                      backgroundColor: theme === 'light' ? Colors.light.tabIconSelected : Colors.dark.tabIconSelected,
                    }]}
                    onPress={() => onChange('MARKET')}
                  >
                    <ThemedText style={value === 'MARKET' && {
                      color: theme === 'light' ? Colors.dark.tabIconSelected : Colors.light.tabIconSelected,
                    }}>Market</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, value === 'LIMIT' && {
                      backgroundColor: theme === 'light' ? Colors.light.tabIconSelected : Colors.dark.tabIconSelected,
                    }]}
                    onPress={() => onChange('LIMIT')}
                  >
                    <ThemedText style={value === 'LIMIT' && {
                      color: theme === 'light' ? Colors.dark.tabIconSelected : Colors.light.tabIconSelected,
                    }}>Limit</ThemedText>
                  </TouchableOpacity>
                </>
              )}
            />
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.formGroup}>
          <Controller
            control={control}
            name="useAmountInstead"
            render={({ field: { value, onChange } }) => (
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => onChange(!value)}
              >
                <ThemedView style={styles.checkbox}>
                  <ThemedView style={value && {
                    ...styles.checkboxActive,
                    backgroundColor: theme === 'light' ? Colors.light.tabIconSelected : Colors.dark.tabIconSelected,
                    borderColor: theme === 'light' ? Colors.light.tabIconSelected : Colors.dark.tabIconSelected,
                  }} />
                </ThemedView>
                <ThemedText style={styles.checkboxLabel}>
                  Usar monto en pesos en lugar de cantidad de acciones.
                </ThemedText>
              </TouchableOpacity>
            )}
          />
        </ThemedView>

        {useAmountInstead ? (
          <ThemedView style={styles.formGroup}>
            <ThemedText>Monto total (en pesos)</ThemedText>
            <Controller
              control={control}
              name="totalAmount"
              rules={{
                required: 'Ingrese el monto total',
                pattern: { value: /^\d+(\.\d{1,2})?$/, message: 'Ingrese un monto válido' }
              }}
              render={({ field: { value, onChange, onBlur } }) => (
                <>
                  <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChange}
                    onBlur={() => {
                      onBlur();
                      calculateQuantity();
                    }}
                    keyboardType="numeric"
                    placeholder="Ej. 10000"
                  />
                  {errors.totalAmount && (
                    <ThemedText type='error'>{errors.totalAmount.message}</ThemedText>
                  )}
                </>
              )}
            />
          </ThemedView>
        ) : (
          <ThemedView style={styles.formGroup}>
            <ThemedText>Cantidad de acciones</ThemedText>
            <Controller
              control={control}
              name="quantity"
              rules={{
                required: 'Ingrese la cantidad de acciones',
                pattern: { value: /^[1-9]\d*$/, message: 'Ingrese un número entero positivo' }
              }}
              render={({ field: { value, onChange, onBlur } }) => (
                <>
                  <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="numeric"
                    placeholder="Ej. 100"
                  />
                  {errors.quantity && (
                    <ThemedText type='error'>{errors.quantity.message}</ThemedText>
                  )}
                </>
              )}
            />
          </ThemedView>
        )}

        {orderType === 'LIMIT' && (
          <ThemedView style={styles.formGroup}>
            <ThemedText>Precio límite</ThemedText>
            <Controller
              control={control}
              name="price"
              rules={{
                required: 'Ingrese el precio límite',
                pattern: { value: /^\d+(\.\d{1,2})?$/, message: 'Ingrese un precio válido' }
              }}
              render={({ field: { value, onChange, onBlur } }) => (
                <>
                  <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="numeric"
                    placeholder={`Último: $${selectedInstrument?.last_price.toFixed(2) || '0.00'}`}
                  />
                  {errors.price && (
                    <ThemedText type='error'>{errors.price.message}</ThemedText>
                  )}
                </>
              )}
            />
          </ThemedView>
        )}

        <TouchableOpacity
          style={[styles.submitButton, {
            backgroundColor: theme === 'light' ? Colors.light.tabIconSelected : Colors.dark.tabIconSelected,
          }]}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText type='defaultSemiBold' style={{
              color: theme === 'light' ? Colors.dark.tabIconSelected : Colors.light.tabIconSelected,
            }}>Enviar Orden</ThemedText>
          )}
        </TouchableOpacity>

      </ThemedView>
    </ScrollView>
  );

  const renderOrderResult = () => (
    <ThemedView style={styles.resultContainer}>
      <ThemedText type="title">Orden {orderResult?.status}</ThemedText>
      <ThemedText>ID de la orden: {orderResult?.id}</ThemedText>
      <ThemedText>Estado: {orderResult?.status}</ThemedText>
      <TouchableOpacity
        style={[styles.submitButton, {
          backgroundColor: theme === 'light' ? Colors.light.tabIconSelected : Colors.dark.tabIconSelected,
        }]}
        onPress={() => {
          setOrderResult(null);
          router.back();
        }}
      >
        <ThemedText type='defaultSemiBold' style={{
          color: theme === 'light' ? Colors.dark.tabIconSelected : Colors.light.tabIconSelected,
        }}>Cerrar</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      {orderResult ? renderOrderResult() : renderOrderForm()}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 8,
  },
  instrumentInfo: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  formGroup: {
    gap: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.3)',
  },
  checkboxActive: {
    width: 12,
    height: 12,
  },
  checkboxLabel: {
    flex: 1,
  },
  submitButton: {
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginTop: 16,
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});