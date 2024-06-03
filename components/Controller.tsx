import React, {useState} from 'react';
import {Button, Input, Icon, Text, Layout} from '@ui-kitten/components';
import {View} from 'react-native';
import {ControllerProps} from '../types/Controller';

const Controller = ({
  title,
  counter,
  sendSearchTerm,
  controlls,
}: ControllerProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value);
    sendSearchTerm(value);
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
        <Text>
          {title} ({counter})
        </Text>
        <Button
          size="small"
          status="basic"
          appearance="ghost"
          accessoryLeft={<Icon name="plus" />}>
          {controlls.charAt(0).toUpperCase() + controlls.slice(1)}
        </Button>
      </View>
      <Input
        value={searchTerm}
        size="small"
        placeholder={`Search for ${controlls}`}
        accessoryRight={<Icon name="search" />}
        accessoryLeft={
          (searchTerm && (
            <Icon
              name="close-outline"
              onPress={() => {
                setSearchTerm('');
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

export default Controller;
