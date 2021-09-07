package com.kdp.golf.game.logic.event;

import com.fasterxml.jackson.annotation.JsonProperty;

public interface Event {

    @JsonProperty EventType type();
    Long gameId();
    Long playerId();

    enum EventType {
        START_GAME,
        TAKE_FROM_DECK,
        TAKE_FROM_TABLE,
        SWAP_CARD,
        DISCARD,
        UNCOVER
    }
}
