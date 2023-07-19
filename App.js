import { StatusBar } from 'expo-status-bar';
import Main from './Main';
import AuthContextProvider from './context/AuthContext';

export default function App() {
  return (
    <AuthContextProvider>
      <Main />
    </AuthContextProvider>
  );
}
