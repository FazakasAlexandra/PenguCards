import React, {useState} from 'react';
import {Button, Input, Icon, Text, Layout} from '@ui-kitten/components';
import {View} from 'react-native';

const DockersControll = (props: {
  docksCount: number;
  filterCards: (searchTerm: string) => void;
  resetFilter: () => void;
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value);
    props.filterCards(value);
  };

  return (
    <Layout
      style={{
        paddingLeft: 12,
        paddingRight: 12,
        paddingBottom: 12,
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
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 4,
        }}>
        <Text>Docks ({props.docksCount})</Text>
        <Button
          size="small"
          status="basic"
          appearance="ghost"
          accessoryLeft={<Icon name="plus" />}>
          Dock
        </Button>
      </View>
      <Input
        value={searchTerm}
        size="small"
        placeholder="Search for dock..."
        accessoryRight={<Icon name="search" />}
        accessoryLeft={
          (searchTerm && (
            <Icon
              name="close-outline"
              onPress={() => {
                setSearchTerm('');
                props.resetFilter();
              }}
            />
          )) ||
          undefined
        }
        onChangeText={handleSearchTermChange}
      />
    </Layout>
  );
};

export default DockersControll;
