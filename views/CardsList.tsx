import {Layout, Card, Text} from '@ui-kitten/components';
import Controller from '../components/Controller';
import LogoHeader from '../components/LogoHeader';
import React, {useState, useEffect, useCallback} from 'react';
import {FlatList, View, ActivityIndicator} from 'react-native';
import {Card as CardT} from '../types/Card';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/Navigation';
import Placeholder from '../assets/icons/placeholder.svg';
import {getCardsByDeck, searchCardsByText} from '../services/databaseService';

type CardsListProps = NativeStackScreenProps<RootStackParamList, 'CardsList'>;

const splitText = (text: string, searchTerm: string) =>
  text.split(new RegExp(`(${searchTerm})`, 'gi'));

const HighlightedFrontText = (props: {
  text: string;
  searchTerm: string;
  splitText: (text: string, searchTerm: string) => string[];
}) => (
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
  const [cards, setCards] = useState<CardT[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const limit = 10;

  const receivedSearchTerm = (str: string) => {
    setSearchTerm(str);
  };

  const loadMoreCards = useCallback(async () => {
    if (loading || !hasMore) {
      return;
    }
    setLoading(true);

    try {
      const newCards = await getCardsByDeck(deck.id, limit, offset);
      setCards(prevCards => [...prevCards, ...newCards]);
      setOffset(prevOffset => prevOffset + limit);
      if (newCards.length < limit) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to fetch cards:', error);
    } finally {
      setLoading(false);
    }
  }, [deck.id, loading, offset, hasMore]);

  useEffect(() => {
    loadMoreCards();
  }, [loadMoreCards]);

  const renderFooter = () => {
    if (!loading) {
      return null;
    }
    return <ActivityIndicator size="large" color="#0000ff" />;
  };

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const fetchedData = await searchCardsByText(searchTerm, limit, offset);
        setCards(fetchedData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCards();
  }, [searchTerm, offset]);

  return (
    <View style={{flex: 1}}>
      <LogoHeader />
      <Controller
        controlls="cards"
        title={deck.title}
        counter={deck.cardsCount}
        sendSearchTerm={receivedSearchTerm}
      />
      <FlatList
        data={cards}
        keyExtractor={item => item.id.toString()}
        onEndReached={loadMoreCards}
        onEndReachedThreshold={0.5}
        numColumns={2}
        ListFooterComponent={renderFooter}
        style={{flex: 1, paddingBottom: 12}}
        contentInsetAdjustmentBehavior="automatic"
        renderItem={({item}) => (
          <Card
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: 'DeckPracticeView',
                    params: {
                      deck,
                      cards,
                      selectedCardId: item.id,
                    },
                  },
                ],
              });
            }}
            style={{
              width: '48%',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 12,
            }}>
            {item.image ? (
              <Placeholder
                style={{alignSelf: 'center'}}
                width={25}
                height={25}
              />
            ) : null}
            <HighlightedFrontText
              text={item.front}
              splitText={splitText}
              searchTerm={searchTerm}
            />
            <HighlightedBackText text={item.back} searchTerm={searchTerm} />
          </Card>
        )}>
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
          }}/>
      </FlatList>
    </View>
  );
};

export default CardsList;
