import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import AddWorkoutScreen from '../src/screens/AddWorkoutScreen';
import CalendarScreen from '../src/screens/CalendarScreen';
import CreateExerciseScreen from '../src/screens/CreateExerciseScreen';
import EditExerciseScreen from '../src/screens/EditExerciseScreen';
import ExerciseLibraryScreen from '../src/screens/ExerciseLibraryScreen';
import HomeScreen from '../src/screens/HomeScreen';
import StartWorkoutScreen from '../src/screens/StartWorkoutScreen';
import { storage } from '../src/services/storage';
import { RootStackParamList } from '../src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Index() {
  useEffect(() => {
    storage.seedDefaultWorkouts();
  }, []);

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
