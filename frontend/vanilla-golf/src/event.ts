import { store } from "./store";
import { sendDiscard, sendSwapCard, sendTakeFromDeck, sendTakeFromTable, sendUncover } from "./websocket";
import { CardLocation, Game } from "./game";

export function onMouseOver(location: CardLocation, hoverCard: CardLocation | null) {
  if (location !== hoverCard) {
    store.publish('SET_HOVER', location);
  }
}

export function onMouseOut(location: CardLocation, hoverCard: CardLocation | null) {
  if (location === hoverCard) {
    store.publish('SET_HOVER', null);
  }
}

export function deckCardClicked(game: Game, userId: number) {
  if (game.stateType === 'TAKE') {
    sendTakeFromDeck(game.id, userId);
  }
}

export function tableCardClicked(game: Game, userId: number) {
  if (game.stateType === 'TAKE') {
    sendTakeFromTable(game.id, userId);
  }
}

export function heldCardClicked(game: Game, userId: number) {
  if (game.stateType === 'DISCARD') {
    sendDiscard(game.id, userId);
  }
}

export function handCardClicked(game: Game, userId: number, handIndex: number) {
  switch (game.stateType) {
    case 'UNCOVER':
    case 'UNCOVER_TWO':
      sendUncover(game.id, userId, handIndex);
      break;
    case 'DISCARD':
      sendSwapCard(game.id, userId, handIndex);
  }
}
