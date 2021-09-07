package com.kdp.golf.websocket.response;

import com.kdp.golf.chat.ChatMessage;

public record ChatResponse(ChatMessage message) implements Response {

    @Override
    public Type type() {
        return Type.CHAT;
    }
}
