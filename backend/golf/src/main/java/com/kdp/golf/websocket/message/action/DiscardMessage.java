package com.kdp.golf.websocket.message.action;

import com.kdp.golf.websocket.message.Message;

public record DiscardMessage(Long gameId,
                             Long playerId) implements Message {

    public Type type() {
        return Type.DISCARD;
    }
}
