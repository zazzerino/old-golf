export interface Player {
  id: number;
  name: string;
  cards: string[];
  heldCard: string;
}

export type GameState = 'INIT' | 'PICKUP' | 'DISCARD' | 'FINAL_PICKUP' | 'FINAL_DISCARD' | 'GAME_OVER';

export interface Game {
  id: number;
  state: GameState;
  players: Player[];
  hostId: number;
  hasStarted: boolean;
  tableCard: string | null;
  tableCards: string[];
  deckCard: string | null;
}

export type ActionType = 'TAKE_FROM_DECK' | 'TAKE_FROM_TABLE' | 'SWAP_CARD' | 'DISCARD';

export interface Action {
  type: ActionType;
  playerId: number;
}

export interface TakeFromDeckAction extends Action {
  type: 'TAKE_FROM_DECK';
}

export function takeFromDeck(playerId: number): TakeFromDeckAction {
  return {
    type: 'TAKE_FROM_DECK',
    playerId,
  }
}

export interface TakeFromTableAction extends Action {
  type: 'TAKE_FROM_TABLE';
}

export function takeFromTable(playerId: number): TakeFromTableAction {
  return {
    type: 'TAKE_FROM_TABLE',
    playerId,
  }
}

export interface SwapCardAction extends Action {
  type: 'SWAP_CARD';
  index: number;
}

export function swapCard(playerId: number, index: number): SwapCardAction {
  return {
    type: 'SWAP_CARD',
    playerId,
    index,
  }
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
