import { createContext, useState } from 'react';

import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const AuthContext = createContext({
  isLoggedIn: false,
  setIsLoggedIn: () => {},

  user: '',
});

const AuthContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState('');
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setIsLoggedIn(true);
      setUser(user.displayName);
    } else {
      setIsLoggedIn(false);
      console.log('No user');
      setUser('');
    }
  });

  const logOut = () => {};

  const value = {
    isLoggedIn,
    setIsLoggedIn,
    user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
