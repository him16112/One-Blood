
import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userBloodGroup, setUserBloodGroup] = useState('');

  return (
    <UserContext.Provider value={{ userBloodGroup, setUserBloodGroup }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
