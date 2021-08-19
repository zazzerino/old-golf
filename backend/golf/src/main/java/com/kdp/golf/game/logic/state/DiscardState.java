package com.kdp.golf.game.logic.state;

import com.kdp.golf.game.logic.card.CardLocation;
import com.kdp.golf.game.logic.Game;
import com.kdp.golf.game.logic.Hand;
import com.kdp.golf.game.logic.event.DiscardEvent;
import com.kdp.golf.game.logic.event.Event;
import com.kdp.golf.game.logic.event.SwapCardEvent;

import java.util.List;
import java.util.Map;

public class DiscardState implements GameState {
    private static DiscardState instance;

    private DiscardState() {}

    public static DiscardState instance() {
        if (instance == null) {
            instance = new DiscardState();
        }
        return instance;
    }

    @Override
    public StateType type() {
        return StateType.DISCARD;
    }

    @Override
    public Game handleEvent(Game game, Event event) {
        var playerId = event.playerId();
        var player = game.getPlayer(playerId).orElseThrow();

        if (game.isPlayersTurn(playerId)) {
            if (event instanceof DiscardEvent) {
                game.discard(playerId);

                var oneCardLeft = player.uncoveredCardCount() == Hand.HAND_SIZE - 1;

                if (oneCardLeft) {
                    game.setState(TakeState.instance());
                    game.nextTurn();
                } else {
                    game.setState(UncoverState.instance());
                }
            } else if (event instanceof SwapCardEvent s) {
                game.swapCard(playerId, s.handIndex());

                var playerFlipped = player.hand().allUncovered();

                if (playerFlipped) {
                    game.setState(FinalTakeState.instance());
                } else {
                    game.setState(TakeState.instance());
                }

                var allFlipped = game.getPlayers().stream()
                        .allMatch(p -> p.hand().allUncovered());

                if (allFlipped) {
                    game.setState(GameOverState.instance());
                }

                game.nextTurn();
            }
        }

        return game;
    }

    @Override
    public List<CardLocation> playableCards(Game game) {
        return List.of(
                CardLocation.HELD,
                CardLocation.HAND0,
                CardLocation.HAND1,
                CardLocation.HAND2,
                CardLocation.HAND3,
                CardLocation.HAND4,
                CardLocation.HAND5);
    }
}
