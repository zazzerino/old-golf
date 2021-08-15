package com.kdp.golf.game.logic.state;

import com.kdp.golf.game.logic.Game;
import com.kdp.golf.game.logic.event.Event;

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
    public Game handleEvent(Game game, Event event) {
        return game;
    }
}
