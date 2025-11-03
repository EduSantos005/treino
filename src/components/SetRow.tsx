import * as Haptics from 'expo-haptics';
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
  repsRef?: (ref: TextInput) => void;
  weightRef?: (ref: TextInput) => void;
  onSubmitReps?: () => void;
}

export function SetRow({ set, onUpdate, onDelete, showDelete = true, repsRef, weightRef, onSubmitReps }: SetRowProps) {
  const [showUnitSelector, setShowUnitSelector] = useState(false);

  const handleComplete = () => {
    const isCompleting = !set.isCompleted;
    if (isCompleting) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onUpdate({ ...set, isCompleted: isCompleting });
  };

  return (
    <View style={[styles.setRow, set.isCompleted && styles.setRowCompleted]}>
      <View style={styles.setHeader}>
        <Text style={[styles.setNumber, set.isCompleted && styles.textCompleted]}>Série {set.number}</Text>
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
          <Text style={[styles.label, set.isCompleted && styles.textCompleted]}>Reps</Text>
          <TextInput
            ref={repsRef}
            style={[
              styles.input,
              set.isCompleted && styles.inputCompleted
            ]}
            value={set.reps}
            onChangeText={(value) => onUpdate({ ...set, reps: value })}
            keyboardType="numeric"
            maxLength={3}
            placeholder="12"
            returnKeyType="next"
            onSubmitEditing={onSubmitReps}
            blurOnSubmit={false}
            editable={!set.isCompleted}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, set.isCompleted && styles.textCompleted]}>Peso</Text>
          <View style={styles.weightContainer}>
            <TextInput
              ref={weightRef}
              style={[
                styles.input, 
                styles.weightInput, 
                set.isCompleted && styles.inputCompleted
              ]}
              value={set.weight}
              onChangeText={(value) => onUpdate({ ...set, weight: value })}
              keyboardType="numeric"
              maxLength={5}
              placeholder="20"
              returnKeyType="done"
              editable={!set.isCompleted}
            />
            <TouchableOpacity 
              style={styles.unitButton}
              onPress={() => !set.isCompleted && setShowUnitSelector(true)}
            >
              <Text style={[styles.unitButtonText, set.isCompleted && styles.textCompleted]}>
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
          onPress={handleComplete}
        >
          <Text style={styles.completeButtonText}>✓</Text>
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
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  setRowCompleted: {
    backgroundColor: '#e8f5e9', // Verde claro
    borderColor: '#34C759',
  },
  setNumber: {
    fontSize: 16,
    fontWeight: '600',
  },
  textCompleted: {
    color: '#9e9e9e',
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
    padding: 10,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
  inputCompleted: {
    backgroundColor: '#f5f5f5',
    color: '#9e9e9e',
    textDecorationLine: 'line-through',
  },
  weightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weightInput: {
    flex: 1,
  },
  completeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderWidth: 2,
    borderColor: '#E5E5EA',
  },
  completedButton: {
    backgroundColor: '#34C759',
    borderColor: '#34C759',
  },
  completeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#34C759',
  },
});