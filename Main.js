import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import LocationTracker from './screens/LocationTracker';
import AuthScreen from './screens/AuthScreen';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const Main = () => {
  const { isLoggedIn } = useContext(AuthContext);
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {isLoggedIn ? (
          <Stack.Screen name={'LocationScreen'} component={LocationTracker} />
        ) : (
          <Stack.Screen name={'AuthScreen'} component={AuthScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Main;
