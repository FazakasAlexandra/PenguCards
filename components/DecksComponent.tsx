import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import {useDecks} from '../contexts/DeckContext';
import {useUser} from '../contexts/UserContext';

const DecksComponent: React.FC = () => {
  const {decks, fetchDecksByUser} = useDecks();
  const {user} = useUser();

  useEffect(() => {
    if (user) {
      fetchDecksByUser(user.id); // Fetch decks for the logged-in user
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View>
      {decks.length > 0 ? (
        decks.map(deck => (
          <View key={deck.id}>
            <Text>{deck.title}</Text>
          </View>
        ))
      ) : (
        <Text>No decks available</Text>
      )}
    </View>
  );
};

export default DecksComponent;
