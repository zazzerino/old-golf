package com.kdp.golf.game.logic.state;

import com.kdp.golf.game.logic.Game;
import com.kdp.golf.game.logic.event.Event;

public class UncoverState implements GameState {
    private static UncoverState instance;

    private UncoverState() {}

    public static UncoverState instance() {
        if (instance == null) {
            instance = new UncoverState();
        }
        return instance;
    }

    @Override
    public Game handleEvent(Game game, Event event) {
        return game;
    }
}
