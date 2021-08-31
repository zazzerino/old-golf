import { store } from "./store";
import { sendDiscard, sendSwapCard, sendTakeFromDeck, sendTakeFromTable, sendUncover } from "./websocket";
import { CardLocation, Game } from "./game";

export interface EventContext {
  game: Game;
  userId: number;
}

export interface HoverEventContext extends EventContext {
  location: CardLocation;
  hoverCard: CardLocation | null;
}

export function mouseOver(context: HoverEventContext) {
  const { game, userId, location, hoverCard } = context;

  if ((game.playerTurn === userId || game.stateType === 'UNCOVER_TWO') && location !== hoverCard) {
    store.publish('SET_HOVER', location);
  }
}

export function mouseOut(context: HoverEventContext) {
  const { game, userId, location, hoverCard } = context;

  if ((game.playerTurn === userId || game.stateType === 'UNCOVER_TWO') && location === hoverCard) {
    store.publish('SET_HOVER', null);
  }
}

export function deckCardClicked(game: Game, userId: number) {
  if (game.playerTurn === userId && game.stateType === 'TAKE') {
    sendTakeFromDeck(game.id, userId);
  }
}

export function tableCardClicked(game: Game, userId: number) {
  if (game.playerTurn === userId && game.stateType === 'TAKE') {
    sendTakeFromTable(game.id, userId);
  }
}

export function heldCardClicked(game: Game, userId: number) {
  if (game.playerTurn === userId && game.stateType === 'DISCARD') {
    sendDiscard(game.id, userId);
  }
}

export function handCardClicked(game: Game, userId: number, handIndex: number) {
  if (game.stateType === 'UNCOVER_TWO') {
    sendUncover(game.id, userId, handIndex);
  }

  if (game.playerTurn === userId) {
    switch (game.stateType) {
      case 'UNCOVER':
        sendUncover(game.id, userId, handIndex);
        break;
      case 'DISCARD':
        sendSwapCard(game.id, userId, handIndex);
    }
  }
}
