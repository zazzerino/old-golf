package com.kdp.golf.game.logic.state;

public class GameOverState implements State {
    public static final GameOverState instance = new GameOverState();

    private GameOverState() {
    }

    @Override
    public Type type() {
        return Type.GAME_OVER;
    }
}
