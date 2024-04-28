import React from 'react';
import {View} from 'react-native';
import PenguCompleted from '../assets/icons/penguCompleted.svg';
import BackRight from '../assets/icons/backRight.svg';
import BackLeft from '../assets/icons/backLeft.svg';
import {Text, Layout, Button} from '@ui-kitten/components';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/Navigation';

type DockCompletedViewProps = NativeStackScreenProps<
  RootStackParamList,
  'DockCompletedView'
>;

const DockCompletedView: React.FC<DockCompletedViewProps> = ({
  route,
  navigation,
}: DockCompletedViewProps) => {
  const goDocks = () => {
    navigation.navigate('Home');
  };

  const goAgain = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'DockPracticeView', params: {dock: route.params.dock}}],
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
        <Button onPress={goDocks}>
          <>
            <Text category="s1" style={{marginRight: 10}}>
              Go docks
            </Text>
            <BackRight />
          </>
        </Button>
      </View>
    </Layout>
  );
};

export default DockCompletedView;
