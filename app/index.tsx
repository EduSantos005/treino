import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import AddWorkoutScreen from '../src/screens/AddWorkoutScreen';
import HomeScreen from '../src/screens/HomeScreen';
import StartWorkoutScreen from '../src/screens/StartWorkoutScreen';
import { storage } from '../src/services/storage';
import { RootStackParamList } from '../src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Index() {
  useEffect(() => {
    // Inicializa os treinos padrão quando o app inicia
    storage.initializeDefaultWorkouts();
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
    </Stack.Navigator>
  );
}
