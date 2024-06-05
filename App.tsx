/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import * as eva from '@eva-design/eva';
import {default as theme} from './custom-theme.json'; // <-- Import app theme
import DeckView from './views/DeckView';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './types/Navigation';
import CardsList from './views/CardsList';
import DeckPracticeView from './views/DeckPracticeView';
import DeckCompletedView from './views/DeckCompletedView';
import {initDatabase} from './services/databaseService';

function App(): React.JSX.Element {
  // const isDarkMode = useColorScheme() === 'dark';
  const Stack = createNativeStackNavigator<RootStackParamList>();

  useEffect(() => {
    initDatabase();
  }, []);

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
            component={DeckView}
            options={{title: 'Home'}}
          />
          <Stack.Screen
            name="CardsList"
            component={CardsList}
            options={{title: 'CardsList'}}
          />
          <Stack.Screen
            name="DeckPracticeView"
            component={DeckPracticeView}
            options={{title: 'DeckPracticeView'}}
          />
          <Stack.Screen
            name="DeckCompletedView"
            component={DeckCompletedView}
            options={{title: 'DeckCompletedView'}}
          />
        </Stack.Navigator>
      </ApplicationProvider>
    </NavigationContainer>
  );
}

export default App;
