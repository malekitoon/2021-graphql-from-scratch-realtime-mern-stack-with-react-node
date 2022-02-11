import React, { useReducer, createContext, useEffect } from 'react';
import { getIdTokenResult, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const firebaseReducer = (state, action) => {
  switch (action.type) {
    case 'LOGGED_IN_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
}

const initialState = {
  user: null,
};

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(firebaseReducer, initialState);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const idTokenResult = await getIdTokenResult(user);

        dispatch({
          type: 'LOGGED_IN_USER',
          payload: { email: user.email, token: idTokenResult.token },
        });
      } else {
        dispatch({
          type: 'LOGGED_IN_USER',
          payload: null,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const value = { state, dispatch };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
