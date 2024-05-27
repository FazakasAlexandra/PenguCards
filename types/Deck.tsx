import {Card} from './Card';

export type Deck = {
  id: string;
  title: string;
  cards: Card[];
  cardsCount: number;
};
