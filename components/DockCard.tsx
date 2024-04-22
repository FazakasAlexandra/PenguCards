import React from 'react';
import {Button, Card, Icon, Text} from '@ui-kitten/components';
import {View} from 'react-native';
import db from '../firebaseConfig';
import {collection, addDoc} from 'firebase/firestore'; // Import the collection method

const CardFooter = ({
  navigateToCardsList,
}: {
  navigateToCardsList: () => void;
}): React.ReactElement => {
  const addCard = async () => {
    console.log('Adding card');
    try {
      const cardsCollection = await collection(db, 'cards');
      await addDoc(cardsCollection, {
        id: 2,
        front: 'The Holy Bible',
        back: 'The Holy Bible is the most sold book in the world',
        hint: 'The most sold book in the world',
      });
      console.log('added card');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 12,
      }}>
      <Button size="small" onPress={() => navigateToCardsList()}>
        Practice
      </Button>
      <Button
        size="small"
        status="basic"
        appearance="ghost"
        onPress={() => addCard()}
        accessoryLeft={<Icon name="plus" />}>
        Cards
      </Button>
    </View>
  );
};

const DockCard = ({
  dock,
  navigateToCardsList,
}: {
  navigateToCardsList: () => void;
  dock: {
    title: string;
    cardsCount: number;
  };
}): React.ReactElement => {
  return (
    <Card
      style={{
        flex: 1,
        marginBottom: 12,
      }}
      footer={<CardFooter navigateToCardsList={navigateToCardsList} />}>
      <Text category="s1">{dock.title}</Text>
      <Text category="p2" style={{marginTop: 4}}>
        {dock.cardsCount} cards
      </Text>
    </Card>
  );
};

export default DockCard;
