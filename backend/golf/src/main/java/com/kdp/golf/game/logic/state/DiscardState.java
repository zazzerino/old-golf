package com.kdp.golf.game.logic.state;

import com.kdp.golf.game.logic.Game;
import com.kdp.golf.game.logic.event.DiscardEvent;
import com.kdp.golf.game.logic.event.Event;
import com.kdp.golf.game.logic.event.SwapCardEvent;

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

        if (game.isPlayersTurn(playerId)) {
            if (event instanceof DiscardEvent) {
                game.discard(playerId);
                game.setState(UncoverState.instance());
            } else if (event instanceof SwapCardEvent s) {
                game.swapCard(playerId, s.handIndex());
                game.nextTurn();
                game.setState(TakeState.instance());
            }
        }

        return game;
    }
}
