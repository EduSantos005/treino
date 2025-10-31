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
import { WORKOUT_CATEGORIES } from '../constants/workoutTypes';
import { WorkoutCategory } from '../services/storage';

interface CategorySelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (category: WorkoutCategory) => void;
  selectedCategory: WorkoutCategory;
}

export function CategorySelector({
  visible,
  onClose,
  onSelect,
  selectedCategory
}: CategorySelectorProps) {
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
            <Text style={styles.modalTitle}>Selecionar Categoria</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.categoryList}>
            {(Object.entries(WORKOUT_CATEGORIES) as [WorkoutCategory, string][]).map(([key, label]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.categoryItem,
                  key === selectedCategory && styles.selectedCategory
                ]}
                onPress={() => {
                  onSelect(key);
                  onClose();
                }}
              >
                <Text style={[
                  styles.categoryText,
                  key === selectedCategory && styles.selectedCategoryText
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
  categoryList: {
    padding: 15,
  },
  categoryItem: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#f8f8f8',
  },
  selectedCategory: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    fontSize: 16,
    color: '#333',
  },
  selectedCategoryText: {
    color: 'white',
    fontWeight: '600',
  },
});