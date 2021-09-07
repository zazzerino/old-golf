package com.kdp.golf.websocket.message;

import com.kdp.golf.chat.ChatMessage;

public record ChatMessageMessage(ChatMessage message) implements Message {

    @Override
    public Type type() {
        return Type.CHAT;
    }
}
