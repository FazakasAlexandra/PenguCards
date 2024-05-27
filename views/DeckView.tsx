import {Layout, Text} from '@ui-kitten/components';
import DeckCard from '../components/DeckCard';
import Controller from '../components/Controller';
import LogoHeader from '../components/LogoHeader';
import React, {useEffect} from 'react';
import {ScrollView, View} from 'react-native';
import Dice from '../assets/icons/dice.svg';
import {Deck} from '../types/Deck';
import {
  getDocs,
  collection,
  DocumentData,
  CollectionReference,
  QuerySnapshot,
} from 'firebase/firestore';
import db from '../firebaseConfig';

const DeckView = ({navigation}: {navigation: any}) => {
  const [decks, setDecks] = React.useState<Deck[]>([]);
  const [filteredDecks, setFilteredDecks] = React.useState<Deck[]>([]);

  useEffect(() => {
    (async () => {
      const decks = await getDecks();
      setDecks(decks);
      setFilteredDecks(decks);
    })();
  }, []);

  const getDecks = async (): Promise<Deck[]> => {
    try {
      const decksCollection: CollectionReference<DocumentData> = collection(
        db,
        'docks',
      );
      const decksSnapshot: QuerySnapshot<DocumentData> = await getDocs(
        decksCollection,
      );
      return decksSnapshot.docs.map(doc => {
        const deck = doc.data();
        return {...deck, id: doc.id, cardsCount: deck.cards.length} as Deck;
      });
    } catch (error) {
      console.error('Error getting collection: ', error);
      return [];
    }
  };

  return (
    <View style={{flex: 1}}>
      <LogoHeader />
      <Controller
        controlls="deck"
        title="Decks"
        counter={decks.length}
        resetFilter={() => setFilteredDecks(decks)}
        filterCards={(searchTerm: string) => {
          const newCards = decks.filter(decks =>
            decks.title.toLowerCase().includes(searchTerm.toLowerCase()),
          );
          setFilteredDecks(newCards);
        }}
      />
      <ScrollView
        style={{flex: 1, paddingBottom: 12}}
        contentInsetAdjustmentBehavior="automatic">
        <Layout
          level="3"
          style={{flex: 1, paddingLeft: 12, paddingRight: 12, paddingTop: 12}}>
          {(filteredDecks.length &&
            filteredDecks.map(deck => (
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
