import React, {createContext, useContext, useState, ReactNode} from 'react';
import {User} from '../types/User';
import {getUser} from '../services/db.ts';

interface UserContextProps {
  user: User | null;
  fetchUser: (id: number) => Promise<void>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async (id: number) => {
    try {
      const fetchedUser = await getUser(id);
      setUser(fetchedUser);
    } catch (error) {
      console.error('Failed to fetch user', error);
    }
  };

  return (
    <UserContext.Provider value={{user, fetchUser}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
