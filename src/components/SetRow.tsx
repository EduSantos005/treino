import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { WEIGHT_UNITS } from '../constants/workoutTypes';
import { Set } from '../services/storage';
import { WeightUnitSelector } from './WeightUnitSelector';

interface SetRowProps {
  set: Set;
  onUpdate: (updatedSet: Set) => void;
  onDelete?: () => void;
  showDelete?: boolean;
}

type WeightUnit = keyof typeof WEIGHT_UNITS;

export function SetRow({ set, onUpdate, onDelete, showDelete = true }: SetRowProps) {
  const [showUnitSelector, setShowUnitSelector] = useState(false);
  return (
    <View style={styles.setRow}>
      <View style={styles.setHeader}>
        <Text style={styles.setNumber}>Série {set.number}</Text>
        {showDelete && onDelete && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={onDelete}
          >
            <Text style={styles.deleteButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.inputs}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Reps</Text>
          <TextInput
            style={styles.input}
            value={set.reps}
            onChangeText={(value) => onUpdate({ ...set, reps: value })}
            keyboardType="numeric"
            maxLength={3}
            placeholder="12"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Peso</Text>
          <View style={styles.weightContainer}>
            <TextInput
              style={[styles.input, styles.weightInput]}
              value={set.weight}
              onChangeText={(value) => onUpdate({ ...set, weight: value })}
              keyboardType="numeric"
              maxLength={5}
              placeholder="20"
            />
            <TouchableOpacity 
              style={styles.unitButton}
              onPress={() => setShowUnitSelector(true)}
            >
              <Text style={styles.unitButtonText}>
                {set.weightUnit.toUpperCase()}
              </Text>
            </TouchableOpacity>
            
            <WeightUnitSelector
              visible={showUnitSelector}
              onClose={() => setShowUnitSelector(false)}
              selectedUnit={set.weightUnit}
              onSelect={(unit) => {
                onUpdate({ ...set, weightUnit: unit });
                setShowUnitSelector(false);
              }}
            />
          </View>
        </View>
        <TouchableOpacity
          style={[
            styles.completeButton,
            set.isCompleted && styles.completedButton
          ]}
          onPress={() => onUpdate({ ...set, isCompleted: !set.isCompleted })}
        >
          <Text style={styles.completeButtonText}>
            {set.isCompleted ? '✓' : '◯'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  setHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  deleteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ff3b30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  unitButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    marginLeft: 8,
  },
  unitButtonText: {
    fontSize: 14,
    color: '#666',
  },
  setRow: {
    marginVertical: 8,
    padding: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  setNumber: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 8,
    textAlign: 'center',
  },
  weightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weightInput: {
    flex: 1,
    marginRight: 4,
  },
  completeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  completedButton: {
    backgroundColor: '#34C759',
  },
  completeButtonText: {
    fontSize: 18,
    color: '#fff',
  },
});