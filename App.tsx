/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import * as eva from '@eva-design/eva';
import {default as theme} from './custom-theme.json'; // <-- Import app theme
import DockView from './views/DockView';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './types/Navigation';
import CardsList from './views/CardsList';

function App(): React.JSX.Element {
  // const isDarkMode = useColorScheme() === 'dark';
  const Stack = createNativeStackNavigator<RootStackParamList>();
  return (
    <NavigationContainer>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={{...eva.light, ...theme}}>
        <Stack.Navigator
          initialRouteName="Home" // Add this to set initial screen
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen
            name="Home"
            component={DockView}
            options={{title: 'Home'}}
          />
          <Stack.Screen
            name="CardsList"
            component={CardsList}
            options={{title: 'CardsList'}}
          />
        </Stack.Navigator>
      </ApplicationProvider>
    </NavigationContainer>
  );
}

export default App;
