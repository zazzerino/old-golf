package com.kdp.golf.websocket.message;

public interface Message {
    Type type();

    enum Type {
        LOGIN,
        CREATE_GAME,
        START_GAME
    }
}
