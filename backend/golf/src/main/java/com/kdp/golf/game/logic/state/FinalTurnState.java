package com.kdp.golf.game.logic.state;

import com.kdp.golf.game.logic.Game;
import com.kdp.golf.game.logic.event.Event;

public class FinalTurnState implements GameState {
    private static FinalTurnState instance;

    private FinalTurnState() {
    }

    public static FinalTurnState instance() {
        if (instance == null) {
            instance = new FinalTurnState();
        }
        return instance;
    }

    @Override
    public Game handleEvent(Game game, Event event) {
        return null;
    }
}
