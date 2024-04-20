import {Layout, Text} from '@ui-kitten/components';
import Controller from '../components/Controller';
import LogoHeader from '../components/LogoHeader';
import React from 'react';
import {ScrollView, View} from 'react-native';
import {Card} from '../types/Card';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/Navigation';

type CardsListProps = NativeStackScreenProps<RootStackParamList, 'CardsList'>;

const CardsList = ({route, navigation}: CardsListProps) => {
  const dock = route.params;
  //const [filteredCards, setFilteredCards] = React.useState(cards);

  return (
    <View style={{flex: 1}}>
      <LogoHeader />
      <Controller
        controlls="cards"
        title={dock.title}
        counter={dock.cardsCount}
        resetFilter={() => {}}
        filterCards={(searchTerm: string) => {}}
      />
      <ScrollView
        style={{flex: 1, paddingBottom: 12}}
        contentInsetAdjustmentBehavior="automatic">
        <Layout
          level="3"
          style={{flex: 1, paddingLeft: 12, paddingRight: 12, paddingTop: 12}}>
          <Text>Cards go here soon</Text>
        </Layout>
      </ScrollView>
    </View>
  );
};

export default CardsList;
