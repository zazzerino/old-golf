package com.kdp.golf.game.logic.state;

import com.kdp.golf.game.logic.Game;
import com.kdp.golf.game.logic.event.Event;
import com.kdp.golf.game.logic.event.UncoverEvent;

public class UncoverTwoState implements GameState {
    private static UncoverTwoState instance;

    private UncoverTwoState() {}

    public static UncoverTwoState instance() {
        if (instance == null) {
            instance = new UncoverTwoState();
        }
        return instance;
    }

    @Override
    public Game handleEvent(Game game, Event event) {
//        if (event instanceof UncoverEvent u) {
//
//        }

        return game;
    }
}
