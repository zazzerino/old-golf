package com.kdp.golf.websocket.message.action;

import com.kdp.golf.websocket.message.Message;

public record UncoverMessage(Long gameId,
                             Long playerId,
                             int handIndex) implements Message {

    public Type type() {
        return Type.UNCOVER;
    }
}
