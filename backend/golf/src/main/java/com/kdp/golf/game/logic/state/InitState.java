package com.kdp.golf.game.logic.state;

import com.kdp.golf.game.logic.Card;
import com.kdp.golf.game.logic.Game;
import com.kdp.golf.game.logic.event.Event;

import java.util.List;

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
    public StateType type() {
        return StateType.INIT;
    }

    @Override
    public Game handleEvent(Game game, Event event) {
        return game;
    }
}
