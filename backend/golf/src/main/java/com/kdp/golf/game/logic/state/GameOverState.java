package com.kdp.golf.game.logic.state;

public class GameOverState implements State {
    public static final GameOverState instance = new GameOverState();

    private GameOverState() {
    }

    @Override
    public StateType type() {
        return StateType.GAME_OVER;
    }
}
