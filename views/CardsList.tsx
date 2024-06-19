import {Layout, Card, Text} from '@ui-kitten/components';
import Controller from '../components/Controller';
import LogoHeader from '../components/LogoHeader';
import React, {useState, useEffect, useCallback} from 'react';
import {ScrollView, View, FlatList, ActivityIndicator} from 'react-native';
import {Card as CardT} from '../types/Card';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/Navigation';
import Placeholder from '../assets/icons/placeholder.svg';
import {getCards} from '../services/databaseService';

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
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [cards, setCards] = useState<CardT[]>(deck.cards);
  // const [loading, setLoading] = useState<boolean>(false);
  // const [hasMore, setHasMore] = useState<boolean>(true);
  // const [offset, setOffset] = useState<number>(0);
  // const limit = 16;

  // const receivedSearchTerm = (str: string) => {
  //   setSearchTerm(str);
  // };

  // const renderFooter = () => {
  //   if (!loading) {
  //     return null;
  //   }
  //   return <ActivityIndicator size="large" color="#0000ff" />;
  // };

  // const loadMoreCards = useCallback(async () => {
  //   if (loading || !hasMore) {
  //     return;
  //   }
  //   setLoading(true);

  //   try {
  //     const newCards = await getCards(deck.id, limit, offset, searchTerm);
  //     setCards(prevCards => [...prevCards, ...newCards]);
  //     setOffset(prevOffset => prevOffset + limit);
  //     if (newCards.length < limit) {
  //       setHasMore(false);
  //     }
  //   } catch (error) {
  //     console.error('Failed to fetch cards:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [deck.id, loading, offset, hasMore]);

  // useEffect(() => {
  //   loadMoreCards();
  // }, [loadMoreCards]);

  return (
    <View style={{flex: 1}}>
      <LogoHeader />
      <Controller
        controls="cards"
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
          setCards(filtered);
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
          {(searchTerm && !cards.length && <Text>No cards found.</Text>) ||
            cards.map((card: CardT, idx) => (
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
