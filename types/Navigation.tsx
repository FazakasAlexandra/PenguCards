import {Card} from './Card';
import {Dock} from './Dock';

export type RootStackParamList = {
  Home: undefined;
  CardsList: Dock;
  DockPracticeView: {dock: Dock; selectedCard?: Card};
};
