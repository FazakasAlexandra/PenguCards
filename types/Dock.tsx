import {Card} from './Card';

export type Dock = {
  id: string;
  title: string;
  cards: Card[];
  cardsCount: number;
};
