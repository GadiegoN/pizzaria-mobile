import { StatusBar } from 'react-native';

import { NavigationContainer } from '@react-navigation/native'
import Routes from './src/routes';
import { AuthProvider } from './src/context/AuthContext';

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <StatusBar barStyle="light-content" translucent backgroundColor='#1d1d2e' />
        <Routes />
      </AuthProvider>
    </NavigationContainer>
  );
}