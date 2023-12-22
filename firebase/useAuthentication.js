import React, { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import { useDispatch } from 'react-redux';

import { fetchUser } from './userSlice';
import { setLoggedIn } from './userSlice';

export function useAuthentication() {
    const dispatch = useDispatch();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
      const fetchUserAndSetIsLoggedIn = async () => {
        try {
          const user = await new Promise((resolve, reject) => {
            const unsubscribe = auth().onAuthStateChanged((user) => {
              resolve(user);
              unsubscribe();
            }, reject);
          });
  
          if (user) {
            setIsLoggedIn(true);
            dispatch(setLoggedIn(true));
            dispatch(fetchUser());
          } else {
            setIsLoggedIn(false);
            dispatch(setLoggedIn(false));
          }
        } catch (error) {
          console.error('(useAuthentication) Authentication Error:', error);
        }
      };
  
      fetchUserAndSetIsLoggedIn();
    }, []);
    

    return {
        isLoggedIn
    };
}