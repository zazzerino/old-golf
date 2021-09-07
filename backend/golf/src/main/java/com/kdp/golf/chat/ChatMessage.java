package com.kdp.golf.chat;

public record ChatMessage(Long gameId,
                          Long userId,
                          String userName,
                          String text) {
}
