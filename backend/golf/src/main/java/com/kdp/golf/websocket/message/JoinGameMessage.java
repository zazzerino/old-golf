package com.kdp.golf.websocket.message;

public record JoinGameMessage(Long gameId,
                              Long userId) implements Message {
    @Override
    public Type type() {
        return Type.JOIN_GAME;
    }
}
