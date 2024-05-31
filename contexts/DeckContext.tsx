import React, {createContext, useContext, useState, ReactNode} from 'react';
import {Deck} from '../types/Deck';
import {getDecksByUser} from '../services/databaseService';

interface DeckContextProps {
  decks: Deck[];
  fetchDecksByUser: (userId: number) => Promise<void>;
}

const DeckContext = createContext<DeckContextProps | undefined>(undefined);

export const DeckProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [decks, setDecks] = useState<Deck[]>([]);

  const fetchDecksByUser = async (userId: number) => {
    try {
      const fetchedDecks = await getDecksByUser(userId);
      setDecks(fetchedDecks);
    } catch (error) {
      console.error('Failed to fetch decks', error);
    }
  };

  return (
    <DeckContext.Provider value={{decks, fetchDecksByUser}}>
      {children}
    </DeckContext.Provider>
  );
};

export const useDecks = () => {
  const context = useContext(DeckContext);
  if (!context) {
    throw new Error('useDecks must be used within a DeckProvider');
  }
  return context;
};
