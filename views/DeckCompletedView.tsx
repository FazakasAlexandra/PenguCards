import React from 'react';
import {View} from 'react-native';
import PenguCompleted from '../assets/icons/penguCompleted.svg';
import BackRight from '../assets/icons/backRight.svg';
import BackLeft from '../assets/icons/backLeft.svg';
import {Text, Layout, Button} from '@ui-kitten/components';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/Navigation';

type DeckCompletedViewProps = NativeStackScreenProps<
  RootStackParamList,
  'DeckCompletedView'
>;

const DeckCompletedView: React.FC<DeckCompletedViewProps> = ({
  route,
  navigation,
}: DeckCompletedViewProps) => {
  const goDecks = () => {
    navigation.navigate('Home');
  };

  const goAgain = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'DeckPracticeView', params: {deck: route.params.deck}}],
    });
  };

  return (
    <Layout
      style={{
        backgroundColor: '#ED9A32',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <PenguCompleted />
      <Text
        category="h1"
        style={{fontSize: 45, color: '#3B3632', marginBottom: 12}}>
        COMPLETED!
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: 300,
        }}>
        <Button onPress={goAgain}>
          <>
            <BackLeft />
            <Text category="s1" style={{marginLeft: 10}}>
              Go again
            </Text>
          </>
        </Button>
        <Button onPress={goDecks}>
          <>
            <Text category="s1" style={{marginRight: 10}}>
              Go decks
            </Text>
            <BackRight />
          </>
        </Button>
      </View>
    </Layout>
  );
};

export default DeckCompletedView;
