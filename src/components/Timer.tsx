import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';

interface TimerProps {
  elapsedTime: number;
  style?: TextStyle;
}

const formatTime = (seconds: number): string => {
  const getSeconds = `0${seconds % 60}`.slice(-2);
  const minutes = Math.floor(seconds / 60);
  const getMinutes = `0${minutes % 60}`.slice(-2);
  const getHours = `0${Math.floor(seconds / 3600)}`.slice(-2);
  return `${getHours}:${getMinutes}:${getSeconds}`;
};

export const Timer = React.memo(({ elapsedTime, style }: TimerProps) => {
  return (
    <Text style={[styles.timer, style]}>
      {formatTime(elapsedTime)}
    </Text>
  );
});

const styles = StyleSheet.create({
  timer: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
});
