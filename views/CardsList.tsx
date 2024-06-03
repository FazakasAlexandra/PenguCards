import {Layout, Card, Text} from '@ui-kitten/components';
import Controller from '../components/Controller';
import LogoHeader from '../components/LogoHeader';
import React, {useEffect} from 'react';
import {ScrollView, View} from 'react-native';
import {Card as CardT} from '../types/Card';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/Navigation';
import Placeholder from '../assets/icons/placeholder.svg';
import {getCardsByDeck, searchCardsByText} from '../services/databaseService';

type CardsListProps = NativeStackScreenProps<RootStackParamList, 'CardsList'>;

const CardsList = ({route, navigation}: CardsListProps) => {
  const deck = route.params;
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [cards, setCards] = React.useState<CardT[]>([]);

  const receivedSearchTerm = (str: string) => {
    setSearchTerm(str);
  };

  useEffect(() => {
    const deckId = deck.id;
    const fetchCards = async () => {
      try {
        const fetchedData = await getCardsByDeck(deckId);
        setCards(fetchedData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCards();
  }, [deck.id]);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const fetchedData = await searchCardsByText(searchTerm);
        setCards(fetchedData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCards();
  }, [searchTerm]);

  const splitText = (text: string) =>
    text.split(new RegExp(`(${searchTerm})`, 'gi'));

  const HighlightedFrontText = (props: {text: string}) => (
    <Text>
      {splitText(props.text).map((part, index) => {
        return (
          <React.Fragment key={index}>
            {part.toLowerCase() === searchTerm.toLowerCase() ? (
              <Text category="s1">{part}</Text>
            ) : (
              <Text>{part}</Text>
            )}
          </React.Fragment>
        );
      })}
    </Text>
  );

  const HighlightedBackText = (props: {text: string}) => (
    <Text>
      {splitText(props.text).map((part, index) => {
        return (
          <React.Fragment key={part + index}>
            {part.toLowerCase() === searchTerm.toLowerCase() ? (
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

  return (
    <View style={{flex: 1}}>
      <LogoHeader />
      <Controller
        controlls="cards"
        title={deck.title}
        counter={deck.cardsCount}
        sendSearchTerm={receivedSearchTerm}
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
          {(searchTerm && !cards.length && <Text>No cards found.</Text>) ||
            cards.map((card: CardT, idx) => (
              <Card
                onPress={() => {
                  navigation.reset({
                    index: 0,
                    routes: [
                      {
                        name: 'DeckPracticeView',
                        params: {
                          deck,
                          selectedCardId: card.id,
                        },
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
                <HighlightedFrontText text={card.front} />
                <HighlightedBackText text={card.back} />
              </Card>
            ))}
        </Layout>
      </ScrollView>
    </View>
  );
};

export default CardsList;
