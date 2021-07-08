type Card = string;

export interface Player {
  id: number;
  name: string;
  cards: Card[];
}

export interface Game {
  id: number;
  players: Player[];
  hostId: number;
  deck: Card[];
  tableCard: Card | null;
  hasStarted: boolean;
}

// export function valueOf(rank: Rank): number {
//   const values: Record<Rank, number> = {
//     'KING': 0,
//     'ACE': 1,
//     'TWO': 2,
//     'THREE': 3,
//     'FOUR': 4,
//     'FIVE': 5,
//     'SIX': 6,
//     'SEVEN': 7,
//     'EIGHT': 8,
//     'NINE': 9,
//     'TEN': 10,
//     'JACK': 10,
//     'QUEEN': 10,
//   };

//   return values[rank];
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
