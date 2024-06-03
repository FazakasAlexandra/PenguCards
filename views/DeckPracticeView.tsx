import {Layout, Card, Text, Button} from '@ui-kitten/components';
import LogoHeader from '../components/LogoHeader';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/Navigation';
import {ProgressBar} from '@ui-kitten/components';
import Lightbulb from '../assets/icons/lightbulb.svg';
import LightbulbCrossed from '../assets/icons/lightbulbCrossed.svg';
import FlipCard from 'react-native-flip-card';
import Swiper from 'react-native-deck-swiper';
import {Card as CardT} from '../types/Card';
import {getCardById} from '../services/databaseService';

type DeckPracticeViewProps = NativeStackScreenProps<
  RootStackParamList,
  'DeckPracticeView'
>;

const DeckPracticeView = ({route, navigation}: DeckPracticeViewProps) => {
  const selectedCardId = +route.params.selectedCardId;
  const cardsCount = route.params.deck.cardsCount;
  const [currentCard, setCurrentCard] = useState<CardT>({});
  const [currentCardId, setCurrentCardId] = useState<number>(
    selectedCardId || 1,
  );
  const [mode, setMode] = useState<'front' | 'back' | 'hint'>('front');
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(
    null,
  );

  const getNextCardId = () => {
    if (swipeDirection === 'left') {
      return currentCardId === 1 ? 1 : currentCardId - 1;
    } else {
      return currentCardId + 1;
    }
  };

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const fetchedCard = await getCardById(currentCardId);
        setCurrentCard(fetchedCard);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCard();
  }, [currentCardId]);

  useEffect(() => {
    if (currentCardId >= cardsCount) {
      navigation.navigate('DeckCompletedView', {deck: route.params.deck});
    }
  }, [currentCardId, cardsCount, navigation]);

  const HintCard = () => {
    return (
      <Card
        style={{
          height: '75%',
          margin: 12,
          backgroundColor: '#ED9A32',
          justifyContent: 'center',
        }}>
        <Text style={{fontSize: 25, alignSelf: 'center'}}>
          {cards[currentCardId].hint}
        </Text>
        <HintButton />
      </Card>
    );
  };

  const NextCard = () => {
    const nextCardIndex = getNextCardId();

    return (
      <Card
        disabled={true}
        style={{
          zIndex: -999,
          height: '95%',
          margin: 12,
          justifyContent: 'center',
        }}>
        <Text style={{fontSize: 25, alignSelf: 'center'}}>
          {cards[nextCardIndex]?.front}
        </Text>
        <HintButton />
      </Card>
    );
  };

  const HintButton = () => {
    return (
      <Card
        onPress={() => {
          setMode(mode === 'hint' ? 'front' : 'hint');
        }}
        style={{
          zIndex: 999,
          position: 'absolute',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#FFE9B5',
          borderRadius: 20,
          borderWidth: 0,
          width: 80,
          alignSelf: 'center',
          marginTop: 150,
        }}>
        <Text category="c2" status="primary">
          HINT
        </Text>
        {mode === 'hint' ? (
          <LightbulbCrossed width={28} height={28} />
        ) : (
          <Lightbulb width={28} height={28} />
        )}
      </Card>
    );
  };

  const onSwipe = () => {
    setMode('front');
    setCurrentCardId(getNextCardId());
  };

  const changeSwipeDirection = (x: number) => {
    if (x > 0) {
      setSwipeDirection('right');
    } else {
      setSwipeDirection('left');
    }
  };

  return (
    <View style={{flex: 1}}>
      <LogoHeader />
      <View>
        <ProgressBar
          progress={currentCardId / cards.length}
          size="giant"
          style={{width: '95%', alignSelf: 'center', height: 18}}
        />
        <Text style={{position: 'absolute', right: '50%'}}>
          {`${currentCardId} / ${cards.length}`}
        </Text>
      </View>
      <Layout level="3" style={{flex: 1}}>
        <Swiper
          showSecondCard={false}
          goBackToPreviousCardOnSwipeLeft={currentCardId !== 0}
          disableLeftSwipe={currentCardId === 0}
          disableTopSwipe={true}
          disableBottomSwipe={true}
          cardVerticalMargin={0}
          cardHorizontalMargin={0}
          ref={ref => {
            ref?.forceUpdate();
          }}
          backgroundColor="transparent"
          containerStyle={{flex: 1}}
          cards={cards}
          swipeBackCard={true}
          cardIndex={currentCardId}
          onSwipedLeft={onSwipe}
          onSwipedRight={onSwipe}
          onSwiping={changeSwipeDirection}
          renderCard={card => {
            return (
              <>
                <FlipCard
                  onFlipStart={() => {
                    setMode(mode === 'front' ? 'back' : 'front');
                  }}
                  style={{height: '100%'}}
                  friction={6}
                  perspective={1000}
                  flipHorizontal={true}
                  flipVertical={false}
                  clickable={true}>
                  {(mode === 'hint' && <HintCard />) || (
                    <Card
                      disabled={true}
                      style={{
                        height: '75%',
                        margin: 12,
                        justifyContent: 'center',
                      }}>
                      <Text style={{fontSize: 25, alignSelf: 'center'}}>
                        {currentCard.front}
                      </Text>
                      <HintButton />
                    </Card>
                  )}
                  <Card
                    disabled={true}
                    style={{
                      height: '75%',
                      margin: 12,
                      backgroundColor: '#3B3632',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 25,
                        alignSelf: 'center',
                      }}>
                      {currentCard.back}
                    </Text>
                  </Card>
                </FlipCard>
              </>
            );
          }}
        />
        {getNextCardId() >= cardsCount ? null : <NextCard />}
      </Layout>
    </View>
  );
};

export default DeckPracticeView;
