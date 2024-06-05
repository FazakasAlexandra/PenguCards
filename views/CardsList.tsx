import {Layout, Card, Text} from '@ui-kitten/components';
import Controller from '../components/Controller';
import LogoHeader from '../components/LogoHeader';
import React from 'react';
import {ScrollView, View} from 'react-native';
import {Card as CardT} from '../types/Card';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/Navigation';
import Placeholder from '../assets/icons/placeholder.svg';

type CardsListProps = NativeStackScreenProps<RootStackParamList, 'CardsList'>;

const splitText = (text: string, searchTerm: string) =>
  text.split(new RegExp(`(${searchTerm})`, 'gi'));

const HighlightedFrontText = (props: {text: string; searchTerm: string}) => (
  <Text>
    {splitText(props.text, props.searchTerm).map((part, index) => {
      return (
        <React.Fragment key={index}>
          {part.toLowerCase() === props.searchTerm.toLowerCase() ? (
            <Text category="s1">{part}</Text>
          ) : (
            <Text>{part}</Text>
          )}
        </React.Fragment>
      );
    })}
  </Text>
);

const HighlightedBackText = (props: {text: string; searchTerm: string}) => (
  <Text>
    {splitText(props.text, props.searchTerm).map((part, index) => {
      return (
        <React.Fragment key={part + index}>
          {part.toLowerCase() === props.searchTerm.toLowerCase() ? (
            <Text
              appearance="hint"
              category="c2"
              style={{textAlign: 'center', marginTop: 4}}>
              {part}
            </Text>
          ) : (
            <Text
              appearance="hint"
              category="c1"
              style={{textAlign: 'center', marginTop: 4}}>
              {part}
            </Text>
          )}
        </React.Fragment>
      );
    })}
  </Text>
);

const CardsList = ({route, navigation}: CardsListProps) => {
  const deck = route.params;
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [filteredCards, setFilteredCards] = React.useState<CardT[]>(deck.cards);

  return (
    <View style={{flex: 1}}>
      <LogoHeader />
      <Controller
        controlls="cards"
        title={deck.title}
        counter={deck.cardsCount}
        resetFilter={() => {}}
        filterCards={(searchTerm: string) => {
          const filtered = deck.cards.filter(
            card =>
              card.front.toLowerCase().includes(searchTerm.toLowerCase()) ||
              card.back.toLowerCase().includes(searchTerm.toLowerCase()),
          );
          setSearchTerm(searchTerm);
          setFilteredCards(filtered);
        }}
      />
      <ScrollView
        style={{flex: 1, paddingBottom: 12}}
        contentInsetAdjustmentBehavior="automatic">
        <Layout
          level="3"
          style={{
            flex: 1,
            paddingHorizontal: 12,
            paddingTop: 12,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          {(searchTerm && !filteredCards.length && (
            <Text>No cards found.</Text>
          )) ||
            filteredCards.map((card: CardT, idx) => (
              <Card
                onPress={() => {
                  navigation.reset({
                    index: 0,
                    routes: [
                      {
                        name: 'DeckPracticeView',
                        params: {deck, selectedCardId: card.id},
                      },
                    ],
                  });
                }}
                key={card.id}
                style={{
                  width: '48%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 12,
                }}>
                {card.image ? (
                  <Placeholder
                    style={{alignSelf: 'center'}}
                    width={25}
                    height={25}
                  />
                ) : null}
                <HighlightedFrontText
                  text={card.front}
                  searchTerm={searchTerm}
                />
                <HighlightedBackText text={card.back} searchTerm={searchTerm} />
              </Card>
            ))}
        </Layout>
      </ScrollView>
    </View>
  );
};

export default CardsList;
