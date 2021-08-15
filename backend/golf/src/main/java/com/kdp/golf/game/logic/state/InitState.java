package com.kdp.golf.game.logic.state;

import com.kdp.golf.game.logic.Game;
import com.kdp.golf.game.logic.event.Event;
import com.kdp.golf.game.logic.event.UncoverEvent;

public class InitState implements GameState {
    private static InitState instance;

    private InitState() {}

    public static InitState instance() {
        if (instance == null) {
            instance = new InitState();
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
