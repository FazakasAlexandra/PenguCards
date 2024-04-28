import {Layout, Card, Text, Button} from '@ui-kitten/components';
import LogoHeader from '../components/LogoHeader';
import React, {useEffect} from 'react';
import {View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/Navigation';
import {ProgressBar} from '@ui-kitten/components';
import Lightbulb from '../assets/icons/lightbulb.svg';
import LightbulbCrossed from '../assets/icons/lightbulbCrossed.svg';
import FlipCard from 'react-native-flip-card';
import Swiper from 'react-native-deck-swiper';
import {Card as CardT} from '../types/Card';

type DockPracticeViewProps = NativeStackScreenProps<
  RootStackParamList,
  'DockPracticeView'
>;

const DockPracticeView = ({route, navigation}: DockPracticeViewProps) => {
  const cards = route.params.dock.cards;
  const [currentCardIndex, setCurrentCardIndex] = React.useState<number>(
    route.params.selectedCardIndex || 0,
  );
  const [mode, setMode] = React.useState<'front' | 'back' | 'hint'>('front');
  const [swipeDirection, setSwipeDirection] = React.useState<
    'left' | 'right' | null
  >(null);

  const getNextCardIndex = () => {
    if (swipeDirection === 'left') {
      return currentCardIndex === 0 ? 0 : currentCardIndex - 1;
    } else {
      return currentCardIndex + 1;
    }
  };

  useEffect(() => {
    if (currentCardIndex >= cards.length) {
      navigation.navigate('DockCompletedView', {dock: route.params.dock});
    }
  }, [currentCardIndex, cards.length, navigation]);

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
          {cards[currentCardIndex].hint}
        </Text>
        <HintButton />
      </Card>
    );
  };

  const NextCard = () => {
    const nextCardIndex = getNextCardIndex();

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
    setCurrentCardIndex(getNextCardIndex());
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
          progress={currentCardIndex / cards.length}
          size="giant"
          style={{width: '95%', alignSelf: 'center', height: 18}}
        />
        <Text style={{position: 'absolute', right: '50%'}}>
          {`${currentCardIndex} / ${cards.length}`}
        </Text>
      </View>
      <Layout level="3" style={{flex: 1}}>
        <Swiper
          showSecondCard={false}
          goBackToPreviousCardOnSwipeLeft={currentCardIndex !== 0}
          disableLeftSwipe={currentCardIndex === 0}
          disableTopSwipe={true}
          disableBottomSwipe={true}
          cardVerticalMargin={0}
          cardHorizontalMargin={0}
          ref={ref => {
            ref?.forceUpdate();
          }}
          onSwiping={changeSwipeDirection}
          containerStyle={{flex: 1}}
          cards={cards}
          swipeBackCard={true}
          cardIndex={currentCardIndex}
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
                        {card.front}
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
                      {card.back}
                    </Text>
                  </Card>
                </FlipCard>
              </>
            );
          }}
          onSwipedLeft={onSwipe}
          onSwipedRight={onSwipe}
          backgroundColor="transparent"
        />
        {getNextCardIndex() >= cards.length ? null : <NextCard />}
      </Layout>
    </View>
  );
};

export default DockPracticeView;
