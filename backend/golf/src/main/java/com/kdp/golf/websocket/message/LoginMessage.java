package com.kdp.golf.websocket.message;

public record LoginMessage(Long userId,
                           String name) implements Message {

    public Type type() {
        return Type.LOGIN;
    }
}
