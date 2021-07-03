package com.kdp.golf.websocket.message;

public record StartGameMessage(Long gameId) implements Message {

    public Type type() {
        return Type.START_GAME;
    }
}
