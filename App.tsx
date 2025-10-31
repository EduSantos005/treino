import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Index from './app';

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Index />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}