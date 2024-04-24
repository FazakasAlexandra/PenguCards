import {Layout, Card, Text} from '@ui-kitten/components';
import LogoHeader from '../components/LogoHeader';
import React from 'react';
import {View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/Navigation';
import {ProgressBar} from '@ui-kitten/components';
import Lightbulb from '../assets/icons/lightbulb.svg';
import LightbulbCrossed from '../assets/icons/lightbulbCrossed.svg';
import GestureRecognizer from 'react-native-swipe-gestures';

type DockPracticeViewProps = NativeStackScreenProps<
  RootStackParamList,
  'DockPracticeView'
>;

const DockPracticeView = ({route, navigation}: DockPracticeViewProps) => {
  console.log(route.params);
  const [currentCard, setCurrentCard] = React.useState<number>(0);
  const [mode, setMode] = React.useState<'front' | 'back' | 'hint'>('front');

  const modeStyles: {
    hint: {backgroundColor: string};
    back: {backgroundColor: string};
    front: {backgroundColor: string};
  } = {
    hint: {
      backgroundColor: '#ED9A32',
    },
    back: {
      backgroundColor: '#3B3632',
    },
    front: {
      backgroundColor: 'white',
    },
  };

  return (
    <View style={{flex: 1}}>
      <LogoHeader />
      <ProgressBar
        progress={0.4}
        size="giant"
        style={{width: '95%', alignSelf: 'center'}}
      />
      <View style={{flex: 1, paddingBottom: 12}}>
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
          <Card
            onPress={() => {
              setMode(mode === 'back' ? 'front' : 'back');
            }}
            style={{
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: modeStyles[mode].backgroundColor,
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: mode === 'back' ? '100%' : '80%',
              }}>
              <Text
                category="s2"
                style={{
                  fontSize: 25,
                  alignSelf: 'center',
                  color: mode === 'back' ? 'white' : '#3B3632',
                }}>
                {route.params.dock.cards[currentCard][mode]}
              </Text>
            </View>
            {mode !== 'back' && (
              <Card
                onPress={() => {
                  setMode(mode === 'hint' ? 'front' : 'hint');
                }}
                style={{
                  bottom: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#FFE9B5',
                  borderRadius: 20,
                  borderWidth: 0,
                  width: 80,
                  alignSelf: 'center',
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
            )}
          </Card>
        </Layout>
      </View>
    </View>
  );
};

export default DockPracticeView;
