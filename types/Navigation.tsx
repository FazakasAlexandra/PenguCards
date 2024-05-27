import {Deck} from './Deck';

export type RootStackParamList = {
  Home: undefined;
  CardsList: Deck;
  DeckPracticeView: {deck: Deck; selectedCardId?: string};
  DeckCompletedView: {deck: Deck};
};
