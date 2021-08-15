package com.kdp.golf.websocket.message;

import com.kdp.golf.game.logic.event.*;

import java.util.Optional;

public record EventMessage(Long gameId,
                           Long playerId,
                           Event.EventType eventType,
                           Optional<Integer> handIndex) implements Message {

    public Type type() {
        return Type.EVENT;
    }

    public Event event() {
        switch (eventType) {
            case TAKE_FROM_DECK -> {
                return new TakeFromDeckEvent(gameId, playerId);
            }
            case TAKE_FROM_TABLE -> {
                return new TakeFromTableEvent(gameId, playerId);
            }
            case SWAP_CARD -> {
                return new SwapCardEvent(gameId, playerId, handIndex.orElseThrow());
            }
            case DISCARD -> {
                return new DiscardEvent(gameId, playerId);
            }
            case UNCOVER -> {
                return new UncoverEvent(gameId, playerId, handIndex.orElseThrow());
            }
            default -> throw new IllegalStateException("Unexpected value: " + eventType);
        }
    }
}
