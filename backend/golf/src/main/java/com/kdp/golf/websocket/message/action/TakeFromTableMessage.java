package com.kdp.golf.websocket.message.action;

import com.kdp.golf.websocket.message.Message;

public record TakeFromTableMessage(Long gameId,
                                   Long playerId) implements Message {

    public Type type() {
        return Type.TAKE_FROM_TABLE;
    }
}
