import {Layout, Card, Text} from '@ui-kitten/components';
import Controller from '../components/Controller';
import LogoHeader from '../components/LogoHeader';
import React from 'react';
import {ScrollView, View} from 'react-native';
import {Card as CardT} from '../types/Card';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/Navigation';
import Placeholder from '../assets/icons/placeholder.svg';

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
          style={{
            flex: 1,
            paddingHorizontal: 12,
            paddingTop: 12,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          {dock.cards.map((card: CardT) => (
            <Card
              key={card.id}
              style={{
                width: '48%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {card.image ? (
                <Placeholder
                  style={{alignSelf: 'center'}}
                  width={25}
                  height={25}
                />
              ) : null}
              <Text style={{textAlign: 'center'}}>{card.front}</Text>
              <Text
                appearance="hint"
                category="c1"
                style={{textAlign: 'center', marginTop: 4}}>
                {card.back}
              </Text>
            </Card>
          ))}
        </Layout>
      </ScrollView>
    </View>
  );
};

export default CardsList;
