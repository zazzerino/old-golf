package com.kdp.golf.game.logic.state;

import com.kdp.golf.game.logic.card.CardLocation;
import com.kdp.golf.game.logic.Game;
import com.kdp.golf.game.logic.Hand;
import com.kdp.golf.game.logic.event.DiscardEvent;
import com.kdp.golf.game.logic.event.Event;
import com.kdp.golf.game.logic.event.SwapCardEvent;

import java.util.List;

public class DiscardState implements State {
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

        if (!game.isPlayersTurn(playerId)) {
            return game;
        }

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

            if (player.getHand().allUncovered()) {
                game.setState(FinalTakeState.instance());
            } else {
                game.setState(TakeState.instance());
            }

            game.nextTurn();

            var allFlipped = game.getPlayers().stream()
                    .allMatch(p -> p.getHand().allUncovered());

            if (allFlipped) {
                game.setState(GameOverState.instance());
            }
        }

        return game;
    }

    @Override
    public List<CardLocation> playableCards(Game game) {
        return List.of(
                CardLocation.HELD,
                CardLocation.H0,
                CardLocation.H1,
                CardLocation.H2,
                CardLocation.H3,
                CardLocation.H4,
                CardLocation.H5);
    }
}
