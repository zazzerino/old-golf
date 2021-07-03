package com.kdp.golf.websocket.message;

public record CreateGameMessage() implements Message {

    public Type type() {
        return Type.CREATE_GAME;
    }
}
