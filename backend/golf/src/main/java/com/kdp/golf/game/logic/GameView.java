package com.kdp.golf.game.logic;

import com.kdp.golf.game.logic.card.Card;
import com.kdp.golf.game.logic.event.Event;
import com.kdp.golf.game.logic.state.State;

import java.util.*;

public record GameView(Long id,
                       Long userId,
                       Long hostId,
                       List<PlayerView> players,
                       State.Type stateType,
                       int turn,
                       Long playerTurn,
                       Deque<Card> tableCards,
                       List<Card.Location> playableCards,
                       List<Event> events) {

    public static GameView from(Game game, Long playerId) {
        var playerCount = game.getPlayers().size();
        var positions = handPositions(playerCount);
        var order = game.playerOrderFrom(playerId);
        List<PlayerView> players = new ArrayList<>();

        for (var i = 0; i < playerCount; i++) {
            var pid = order.get(i);
            var player = game.getPlayer(pid).orElseThrow();
            var hand = player.getHand();
            var playerView = new PlayerView(
                    player.id,
                    player.getName(),
                    positions.get(i),
                    hand.cards(),
                    hand.uncoveredCards(),
                    player.getHeldCard(),
                    player.getHand().visibleScore());

            players.add(playerView);
        }

        return new GameView(
                game.id,
                playerId,
                game.getHostId(),
                players,
                game.getStateType(),
                game.getTurn(),
                game.playerTurn(),
                game.getTableCards(),
                game.playableCards(playerId),
                game.getEvents());
    }
    
    public static List<HandPosition> handPositions(int playerCount) {
        return switch (playerCount) {
            case 1 -> List.of(HandPosition.BOTTOM);
            case 2 -> List.of(HandPosition.BOTTOM, HandPosition.TOP);
            case 3 -> List.of(HandPosition.BOTTOM, HandPosition.LEFT, HandPosition.RIGHT);
            case 4 -> List.of(HandPosition.BOTTOM, HandPosition.LEFT, HandPosition.TOP, HandPosition.RIGHT);
            default -> throw new IllegalStateException("playerCount must be between 1 and 4: " + playerCount);
        };
    }

    public record PlayerView(Long id,
                             String name,
                             HandPosition handPosition,
                             List<Card> cards,
                             Set<Integer> uncoveredCards,
                             Optional<Card> heldCard,
                             int score) {
    }

    public enum HandPosition {
        BOTTOM,
        LEFT,
        TOP,
        RIGHT
    }
}
