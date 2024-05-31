import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import {useUser} from '../contexts/UserContext';

const UserComponent: React.FC = () => {
  const {user, fetchUser} = useUser();

  useEffect(() => {
    fetchUser(1); // Fetch user with id 1
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View>
      {user ? (
        <>
          <Text>{user.name}</Text>
          <Text>{user.email}</Text>
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

export default UserComponent;
