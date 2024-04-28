import {Dock} from './Dock';

export type RootStackParamList = {
  Home: undefined;
  CardsList: Dock;
  DockPracticeView: {dock: Dock; selectedCardIndex?: number};
  DockCompletedView: {dock: Dock};
};
