import {Layout, Text} from '@ui-kitten/components';
import DeckCard from '../components/DeckCard';
import Controller from '../components/Controller';
import LogoHeader from '../components/LogoHeader';
import React, {useState, useEffect} from 'react';
import {ScrollView, View} from 'react-native';
import Dice from '../assets/icons/dice.svg';
import {Deck} from '../types/Deck';
import {getDecksByUser, searchDecksByTitle} from '../services/databaseService';

const DeckView = ({navigation}: {navigation: any}) => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const receivedSearchTerm = (str: string) => {
    setSearchTerm(str);
  };

  useEffect(() => {
    const userId = 1;
    const fetchDecks = async () => {
      try {
        const fetchedData = await getDecksByUser(userId);
        setDecks(fetchedData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDecks();
  }, []);

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const fetchedData = await searchDecksByTitle(searchTerm);
        setDecks(fetchedData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDecks();
  }, [searchTerm]);

  return (
    <View style={{flex: 1}}>
      <LogoHeader />
      <Controller
        controlls="deck"
        title="Decks"
        counter={decks.length}
        sendSearchTerm={receivedSearchTerm}
      />
      <ScrollView
        style={{flex: 1, paddingBottom: 12}}
        contentInsetAdjustmentBehavior="automatic">
        <Layout
          level="3"
          style={{flex: 1, paddingLeft: 12, paddingRight: 12, paddingTop: 12}}>
          {(decks.length &&
            decks.map(deck => (
              <DeckCard
                deck={deck}
                key={deck.id}
                navigateToCardsList={() => {
                  navigation.navigate('CardsList', deck);
                }}
              />
            ))) || <Text>Deck not found.</Text>}
        </Layout>
      </ScrollView>
      <Layout
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          zIndex: 100,
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}>
        <Dice width={40} height={40} />
        <Text>Go random!</Text>
      </Layout>
    </View>
  );
};

export default DeckView;
