// import { getGame, getPlayerId } from "./oldstate";
import { sendDiscard, sendSwapCard, sendTakeFromDeck, sendTakeFromTable, sendUncover } from "./websocket";

export function deckCardClicked() {
  // const game = getGame();
  // const playerId = getPlayerId();

  // if (game.stateType === 'TAKE') {
  //   sendTakeFromDeck(game.id, playerId);
  // }
}

export function tableCardClicked() {
  // const game = getGame();
  // const playerId = getPlayerId();

  // if (game.stateType === 'TAKE') {
  //   sendTakeFromTable(game.id, playerId);
  // }
}

export function heldCardClicked() {
  // const game = getGame();
  // const playerId = getPlayerId();

  // if (game.stateType === 'DISCARD') {
  //   sendDiscard(game.id, playerId);
  // }
}

export function handCardClicked(handIndex: number) {
  // const game = getGame();
  // const playerId = getPlayerId();
  
  // switch (game.stateType) {
  //   case 'UNCOVER':
  //   case 'UNCOVER_TWO':
  //     sendUncover(game.id, playerId, handIndex);
  //     break;
    
  //   case 'DISCARD':
  //     sendSwapCard(game.id, playerId, handIndex);
  //     break;
  // }
}
