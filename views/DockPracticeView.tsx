import {Layout, Card, Text} from '@ui-kitten/components';
import LogoHeader from '../components/LogoHeader';
import React from 'react';
import {View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/Navigation';
import {ProgressBar} from '@ui-kitten/components';
import Lightbulb from '../assets/icons/lightbulb.svg';
import LightbulbCrossed from '../assets/icons/lightbulbCrossed.svg';
import FlipCard from 'react-native-flip-card';

type DockPracticeViewProps = NativeStackScreenProps<
  RootStackParamList,
  'DockPracticeView'
>;

const DockPracticeView = ({route, navigation}: DockPracticeViewProps) => {
  console.log(route.params);
  const [currentCard, setCurrentCard] = React.useState<number>(0);
  const [mode, setMode] = React.useState<'front' | 'back' | 'hint'>('front');

  const HintButton = () => {
    return (
      <Card
        onPress={() => {
          console.log('pressed!');
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

  return (
    <View style={{flex: 1}}>
      <LogoHeader />
      <View>
        <ProgressBar
          progress={currentCard + 1 / route.params.dock.cardsCount}
          size="giant"
          style={{width: '95%', alignSelf: 'center', height: 18}}
        />
        <Text style={{position: 'absolute', right: '50%'}}>
          {`${currentCard + 1} / ${route.params.dock.cardsCount}`}
        </Text>
      </View>
      <Layout level="3" style={{flex: 1, padding: 12}}>
        {(mode !== 'hint' && (
          <FlipCard
            onFlipStart={() => {
              setMode(mode === 'front' ? 'back' : 'front');
            }}
            friction={6}
            perspective={1000}
            flipHorizontal={true}
            flipVertical={false}
            clickable={true}>
            <Card
              disabled={true}
              style={{
                height: '100%',
                justifyContent: 'center',
              }}>
              <Text style={{fontSize: 25, alignSelf: 'center'}}>
                {route.params.dock.cards[currentCard].front}
              </Text>
              <HintButton />
            </Card>
            <Card
              disabled={true}
              style={{
                height: '100%',
                backgroundColor: '#3B3632',
                justifyContent: 'center',
              }}>
              <Text style={{color: 'white', fontSize: 25, alignSelf: 'center'}}>
                {route.params.dock.cards[currentCard].back}
              </Text>
            </Card>
          </FlipCard>
        )) || (
          <Card
            style={{
              zIndex: 99,
              height: '100%',
              backgroundColor: '#ED9A32',
              justifyContent: 'center',
            }}>
            <Text style={{fontSize: 25, alignSelf: 'center'}}>
              {route.params.dock.cards[currentCard].hint}
            </Text>
            <HintButton />
          </Card>
        )}
      </Layout>
    </View>
  );
};

export default DockPracticeView;
