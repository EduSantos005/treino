import React from 'react';
import {
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { WEIGHT_UNITS } from '../constants/workoutTypes';

interface WeightUnitSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (unit: keyof typeof WEIGHT_UNITS) => void;
  selectedUnit: keyof typeof WEIGHT_UNITS;
}

export function WeightUnitSelector({
  visible,
  onClose,
  onSelect,
  selectedUnit
}: WeightUnitSelectorProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Unidade de Peso</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.unitList}>
            {(Object.entries(WEIGHT_UNITS)).map(([key, label]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.unitItem,
                  key === selectedUnit && styles.selectedUnit
                ]}
                onPress={() => {
                  onSelect(key as keyof typeof WEIGHT_UNITS);
                  onClose();
                }}
              >
                <Text style={[
                  styles.unitText,
                  key === selectedUnit && styles.selectedUnitText
                ]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
  },
  unitList: {
    padding: 15,
  },
  unitItem: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#f8f8f8',
  },
  selectedUnit: {
    backgroundColor: '#007AFF',
  },
  unitText: {
    fontSize: 16,
    color: '#333',
  },
  selectedUnitText: {
    color: 'white',
    fontWeight: '600',
  },
});