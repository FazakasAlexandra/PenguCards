import {Layout, Text} from '@ui-kitten/components';
import DockCard from '../components/DockCard';
import Controller from '../components/Controller';
import LogoHeader from '../components/LogoHeader';
import React from 'react';
import {ScrollView, View} from 'react-native';
import Dice from '../assets/icons/dice.svg';
import {Dock} from '../types/Dock';

const DockView = ({navigation}: {navigation: any}) => {
  const cards: Dock[] = [
    {
      id: 1,
      title: 'Schwarze Swan',
      cardsCount: 12,
    },
    {
      id: 2,
      title: 'The Holy Bible',
      cardsCount: 192,
    },
    {
      id: 3,
      title: 'Comunist Manifesto',
      cardsCount: 55,
    },
    {
      id: 4,
      title: 'Comunist Manifesto',
      cardsCount: 55,
    },
    {
      id: 5,
      title: 'Comunist Manifesto',
      cardsCount: 55,
    },
  ];

  const [filteredCards, setFilteredCards] = React.useState(cards);

  return (
    <View style={{flex: 1}}>
      <LogoHeader />
      <Controller
        controlls="dock"
        title="Docks"
        counter={cards.length}
        resetFilter={() => setFilteredCards(cards)}
        filterCards={(searchTerm: string) => {
          const newCards = cards.filter(card =>
            card.title.toLowerCase().includes(searchTerm.toLowerCase()),
          );
          setFilteredCards(newCards);
        }}
      />
      <ScrollView
        style={{flex: 1, paddingBottom: 12}}
        contentInsetAdjustmentBehavior="automatic">
        <Layout
          level="3"
          style={{flex: 1, paddingLeft: 12, paddingRight: 12, paddingTop: 12}}>
          {(filteredCards.length &&
            filteredCards.map(card => (
              <DockCard
                card={card}
                key={card.id}
                navigateToCardsList={() => {
                  navigation.navigate('CardsList', card);
                }}
              />
            ))) || <Text>Dock not found.</Text>}
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

export default DockView;
