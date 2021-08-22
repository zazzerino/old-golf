package com.kdp.golf.game.logic.state;

public class InitState implements State {
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
}
