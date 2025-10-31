import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddWorkoutScreen from './screens/AddWorkoutScreen';
import HomeScreen from './screens/HomeScreen';
import { RootStackParamList } from './types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: true,
          headerBackTitleVisible: false,
        }}
      >
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}