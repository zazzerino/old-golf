import { getGame, getPlayerId, store } from "./store";
import { sendDiscard, sendSwapCard, sendTakeFromDeck, sendTakeFromTable, sendUncover } from "./websocket";

export function deckCardClicked() {
  const game = getGame(store.state);
  const playerId = getPlayerId(store.state);

  if (game?.stateType === 'TAKE' && playerId != null) {
    sendTakeFromDeck(game.id, playerId);
  }
}

export function tableCardClicked() {
  const game = getGame(store.state);
  const playerId = getPlayerId(store.state);

  if (game?.stateType === 'TAKE' && playerId != null) {
    sendTakeFromTable(game.id, playerId);
  }
}

export function heldCardClicked() {
  const game = getGame(store.state);
  const playerId = getPlayerId(store.state);

  if (game != null && game.stateType === 'DISCARD' && playerId != null) {
    sendDiscard(game.id, playerId);
  }
}

export function handCardClicked(handIndex: number) {
  const game = getGame(store.state);
  const playerId = getPlayerId(store.state);

  if (game && playerId != null) {

    switch (game.stateType) {
      case 'UNCOVER':
      case 'UNCOVER_TWO':
        sendUncover(game.id, playerId, handIndex);
        break;

      case 'DISCARD':
        sendSwapCard(game.id, playerId, handIndex);
        break;
    }
  }
}
