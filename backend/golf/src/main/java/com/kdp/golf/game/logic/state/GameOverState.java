package com.kdp.golf.game.logic.state;

public class GameOverState implements State {
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
    public StateType type() {
        return StateType.GAME_OVER;
    }
}
