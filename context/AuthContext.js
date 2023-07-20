import { createContext, useState } from 'react';

import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const AuthContext = createContext({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  uid: '',
  user: '',
});

const AuthContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState('');
  const [userId, setUserId] = useState('');
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setIsLoggedIn(true);
      setUserId(user.uid);

      setUser(user.email);
    } else {
      setIsLoggedIn(false);

      setUser('');
      setUserId('');
    }
  });

  const logOut = () => {};

  const value = {
    isLoggedIn,
    setIsLoggedIn,
    user,
    uid: userId,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
