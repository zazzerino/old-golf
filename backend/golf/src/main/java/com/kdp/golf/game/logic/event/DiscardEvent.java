package com.kdp.golf.game.logic.event;

public record DiscardEvent(Long gameId,
                           Long playerId) implements Event {

    public EventType type() {
        return EventType.DISCARD;
    }
}
