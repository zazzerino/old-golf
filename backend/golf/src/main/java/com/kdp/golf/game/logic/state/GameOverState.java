package com.kdp.golf.game.logic.state;

import com.kdp.golf.game.logic.Game;
import com.kdp.golf.game.logic.event.Event;

public class GameOverState implements GameState {
    private static GameOverState instance;

    private GameOverState() {
    }

    public static GameOverState instance() {
        if (instance == null) {
            instance = new GameOverState();
        }
        return instance;
    }

    @Override
    public Game handleEvent(Game game, Event event) {
        return null;
    }
}
