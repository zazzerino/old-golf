package com.kdp.golf.game.logic.state;

import com.kdp.golf.game.logic.Game;
import com.kdp.golf.game.logic.event.Event;
import com.kdp.golf.game.logic.event.TakeFromDeckEvent;
import com.kdp.golf.game.logic.event.TakeFromTableEvent;

public class FinalTakeState implements GameState {
    private static FinalTakeState instance;

    private FinalTakeState() {}

    public static FinalTakeState instance() {
        if (instance == null) {
            instance = new FinalTakeState();
        }
        return instance;
    }

    @Override
    public Game handleEvent(Game game, Event event) {
        var playerId = event.playerId();

        if (game.isPlayersTurn(playerId)) {
            if (event instanceof TakeFromDeckEvent) {
                game.takeFromDeck(playerId);
                game.setState(FinalDiscardState.instance());
            } else if (event instanceof TakeFromTableEvent t) {
                game.takeFromTable(playerId);
                game.setState(FinalDiscardState.instance());
            }
        }

        return game;
    }

    @Override
    public StateType type() {
        return StateType.FINAL_TAKE;
    }
}
