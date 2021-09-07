package com.kdp.golf.game.logic.state;

public class InitState implements State {
    public static final InitState instance = new InitState();

    private InitState() {}

    @Override
    public Type type() {
        return Type.INIT;
    }
}
