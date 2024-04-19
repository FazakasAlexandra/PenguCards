/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import NativeDevSettings from 'react-native/Libraries/NativeModules/specs/NativeDevSettings';

AppRegistry.registerComponent(appName, () => App);
