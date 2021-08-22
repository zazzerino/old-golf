package com.kdp.golf.websocket.message;

public record StartGameMessage(Long gameId, Long playerId) implements Message {

    public Type type() {
        return Type.START_GAME;
    }
}
