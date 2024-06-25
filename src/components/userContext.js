import React, { createContext, useState } from "react";


// Creating a Context
export const UserContext = createContext();

// Create a Provider component

export const UserProvider = ({children}) => {
  const [user, setUser] = useState("");

  return (
    <UserContext.Provider value = {{user, setUser}}>
     {children}
    </UserContext.Provider>
  )
}

