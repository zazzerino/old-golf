package com.kdp.golf.game.logic.event;

public record UncoverEvent(Long gameId,
                           Long playerId,
                           int handIndex) implements Event {

    public EventType type() {
        return EventType.UNCOVER;
    }
}
