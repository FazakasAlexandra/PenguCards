import {Layout, Text} from '@ui-kitten/components';
import DockCard from '../components/DockCard';
import Controller from '../components/Controller';
import LogoHeader from '../components/LogoHeader';
import React, {useEffect} from 'react';
import {ScrollView, View} from 'react-native';
import Dice from '../assets/icons/dice.svg';
import {Dock} from '../types/Dock';
import {
  getDocs,
  collection,
  DocumentData,
  CollectionReference,
  QuerySnapshot,
} from 'firebase/firestore';
import db from '../firebaseConfig';

const DockView = ({navigation}: {navigation: any}) => {
  const [docks, setDocks] = React.useState<Dock[]>([]);
  const [filteredDocks, setFilteredDocks] = React.useState<Dock[]>([]);

  useEffect(() => {
    (async () => {
      const docks = await getDocks();
      setDocks(docks);
      setFilteredDocks(docks);
    })();
  }, []);

  const getDocks = async (): Promise<Dock[]> => {
    try {
      const docksCollection: CollectionReference<DocumentData> = collection(
        db,
        'docks',
      );
      const docksSnapshot: QuerySnapshot<DocumentData> = await getDocs(
        docksCollection,
      );
      return docksSnapshot.docs.map(doc => {
        const dock = doc.data();
        return {...dock, id: doc.id, cardsCount: dock.cards.length} as Dock;
      });
    } catch (error) {
      console.error('Error getting collection: ', error);
      return [];
    }
  };

  return (
    <View style={{flex: 1}}>
      <LogoHeader />
      <Controller
        controlls="dock"
        title="Docks"
        counter={docks.length}
        resetFilter={() => setFilteredDocks(docks)}
        filterCards={(searchTerm: string) => {
          const newCards = docks.filter(docks =>
            docks.title.toLowerCase().includes(searchTerm.toLowerCase()),
          );
          setFilteredDocks(newCards);
        }}
      />
      <ScrollView
        style={{flex: 1, paddingBottom: 12}}
        contentInsetAdjustmentBehavior="automatic">
        <Layout
          level="3"
          style={{flex: 1, paddingLeft: 12, paddingRight: 12, paddingTop: 12}}>
          {(filteredDocks.length &&
            filteredDocks.map(dock => (
              <DockCard
                dock={dock}
                key={dock.id}
                navigateToCardsList={() => {
                  navigation.navigate('CardsList', dock);
                }}
              />
            ))) || <Text>Dock not found.</Text>}
        </Layout>
      </ScrollView>
      <Layout
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          zIndex: 100,
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}>
        <Dice width={40} height={40} />
        <Text>Go random!</Text>
      </Layout>
    </View>
  );
};

export default DockView;
