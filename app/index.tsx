import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import AddWorkoutScreen from '../src/screens/AddWorkoutScreen';
import CalendarScreen from '../src/screens/CalendarScreen';
import CreateExerciseScreen from '../src/screens/CreateExerciseScreen';
import EditExerciseScreen from '../src/screens/EditExerciseScreen';
import ExerciseLibraryScreen from '../src/screens/ExerciseLibraryScreen';
import HomeScreen from '../src/screens/HomeScreen';
import StartWorkoutScreen from '../src/screens/StartWorkoutScreen';
import { initDB, seedDefaultWorkouts, clearDatabase } from '../src/services/database';
import { RootStackParamList } from '../src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeDB = async () => {
      try {
        const database = await initDB();
        await clearDatabase(database); // Apenas para desenvolvimento, remova em produção
        await seedDefaultWorkouts(database);
        console.log('Banco de dados inicializado e populado');
      } catch (error) {
        console.error('Erro ao inicializar o banco de dados:', error);
      } finally {
        setIsLoading(false);
      }
    };
    initializeDB();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'AppTreino' }}
      />
      <Stack.Screen 
        name="AddWorkout" 
        component={AddWorkoutScreen} 
        options={{ title: 'Novo Treino' }}
      />
      <Stack.Screen 
        name="StartWorkout" 
        component={StartWorkoutScreen} 
        options={{ 
          title: 'Treino em Andamento',
          headerBackTitle: 'Voltar'
        }}
      />
      <Stack.Screen 
        name="Calendar" 
        component={CalendarScreen} 
        options={{ 
          title: 'Histórico',
          headerBackTitle: 'Voltar'
        }}
      />
      <Stack.Screen 
        name="ExerciseLibrary" 
        component={ExerciseLibraryScreen} 
        options={{ 
          title: 'Biblioteca',
          headerBackTitle: 'Voltar'
        }}
      />
      <Stack.Screen 
        name="CreateExercise" 
        component={CreateExerciseScreen} 
        options={{ 
          title: 'Criar Exercício',
          headerBackTitle: 'Voltar'
        }}
      />
      <Stack.Screen 
        name="EditExercise" 
        component={EditExerciseScreen} 
        options={{ 
          title: 'Editar Exercício',
          headerBackTitle: 'Voltar'
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
