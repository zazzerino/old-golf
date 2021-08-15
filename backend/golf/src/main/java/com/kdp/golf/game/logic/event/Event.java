package com.kdp.golf.game.logic.event;

public interface Event {

    EventType type();
    Long gameId();
    Long playerId();

    enum EventType {
        TAKE_FROM_DECK,
        TAKE_FROM_TABLE,
        SWAP_CARD,
        DISCARD,
        UNCOVER
    }
}
