package com.kdp.golf.game.logic.state;

import com.kdp.golf.game.logic.Game;
import com.kdp.golf.game.logic.event.Event;

public class UncoverAllState implements GameState {
    private static UncoverAllState instance;

    private UncoverAllState() {
    }

    public static UncoverAllState instance() {
        if (instance == null) {
            instance = new UncoverAllState();
        }
        return instance;
    }

    @Override
    public Game handleEvent(Game game, Event event) {
        return game;
    }
}
