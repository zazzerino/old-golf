import { CardLocation, Game, Player } from "./game";
import { State } from "./store";
import { User } from "./user";

export function getUser(state: State): User | undefined {
  return state.user;
}

export function getUserId(state: State): number | undefined {
  return state.user?.id;
}

export function getGame(state: State): Game | undefined {
  return state.game;
}

export function getGameId(state: State): number | undefined {
  return state.game?.id;
}

export function getGames(state: State): Game[] {
  return state.games;
}

export function getPlayer(state: State): Player | undefined {
  const user = getUser(state);
  const game = getGame(state);

  if (user && game) {
    return game.players.find(player => player.id === user.id);
  }
}

export function getPlayerId(state: State): number | undefined {
  return getPlayer(state)?.id;
}

export function getHand(state: State): string[] | undefined {
  return getPlayer(state)?.hand.cards;
}

export function getHeldCard(state: State): string | undefined {
  return getPlayer(state)?.heldCard;
}

export function getScore(state: State): number | undefined {
  return getPlayer(state)?.hand.visibleScore;
}

export function isPlayersTurn(state: State): boolean {
  const playerId = getPlayerId(state);
  return state.game?.playerTurn === playerId;
}

export function getPlayableCards(state: State) {
  const playerId = getPlayerId(state);
  const map = state.game?.playableCards;

  if (playerId != null && map) {
    return map[playerId];
  }
}

export function getUncoveredCards(state: State): number[] | undefined {
  return getPlayer(state)?.hand.uncoveredCards;
}

export function getHoverCard(state: State): CardLocation | undefined {
  return state.hoverCard;
}
