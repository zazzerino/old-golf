package com.kdp.golf.websocket.message;

public interface Message {
    Type type();

    enum Type {
        LOGIN,
        JOIN_GAME,
        CREATE_GAME,
        START_GAME,
        EVENT,
        CHAT,
    }
}
