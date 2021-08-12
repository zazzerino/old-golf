package com.kdp.golf.websocket.message.action;

import com.kdp.golf.websocket.message.Message;

public record SwapCardMessage(Long gameId,
                              Long playerId,
                              int index) implements Message {

    public Type type() {
        return Type.SWAP_CARD;
    }
}
