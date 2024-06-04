import {Card} from './Card';

export type Deck = {
  id: number;
  title: string;
  cards: Card[];
  cardsCount: number;
  user_id: number;
};
