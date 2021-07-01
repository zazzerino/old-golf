import * as _ from 'lodash';

export type Suit = 'C' | 'D' | 'H' | 'S';

export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K';

export interface Card {
  suit: Suit;
  rank: Rank;
}

export const suits: Suit[] = ['C', 'D', 'H', 'S'];

export const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];

export interface Player {
  id: number;
  name: string;
  hand: Card[];
}

export interface Game {
  id: number;
  players: Player[];
  deck: Card[];
}

// export function valueOf(rank: Rank): number {
//   const values = {
//     'K': 0,
//     'A': 1,
//     '2': 2,
//     '3': 3,
//     '4': 4,
//     '5': 5,
//     '6': 6,
//     '7': 7,
//     '8': 8,
//     '9': 9,
//     'T': 10,
//     'J': 10,
//     'Q': 10,
//   };

//   return values[rank];
// }

// export function makeDeck(): Card[] {
//   const deck: Card[] = [];

//   for (const suit of suits) {
//     for (const rank of ranks) {
//       deck.push({ suit, rank });
//     }
//   }

//   return deck;
// }

// export function dealCard(deck: Card[]): { card: Card, deck: Card[] } {
//   return {
//     card: deck[0],
//     deck: _.drop(deck),
//   }
// }

// export function score(hand: Card[]): number {
//   const vals = hand.map(card => valueOf(card.rank));

//   // check for outer 4 matches
//   if (vals[0] === vals[2] &&
//       vals[0] === vals[3] &&
//       vals[0] === vals[5]) {
//     const middleVals = [vals[1], vals[4]];
//     return _.sum(middleVals) - 20;
//   }

//   // check for adjacent 4 matches
//   if (vals[0] == vals[3] &&
//       vals[1] == vals[4]) {
//     const rightVals = [vals[2], vals[5]];
//     return _.sum(rightVals) - 10;
//   }

//   if (vals[1] == vals[4] &&
//       vals[2] == vals[5]) {
//     const leftVals = [vals[0], vals[3]];
//     return _.sum(leftVals) - 10;
//   }

//   // check for vertical matches
//   if (vals[0] === vals[3]) {
//     return _.sum([vals[1], vals[2], vals[4], vals[5]]);
//   } else if (vals[1] === vals[4]) {
//     return _.sum([vals[0], vals[2], vals[3], vals[5]]);
//   } else if (vals[2] === vals[5]) {
//     return _.sum([vals[0], vals[1], vals[3], vals[4]]);
//   }

//   // nothing found, return the sum of all cards
//   return _.sum(vals);
// }
