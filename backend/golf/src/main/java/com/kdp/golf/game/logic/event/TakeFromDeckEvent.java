package com.kdp.golf.game.logic.event;

public record TakeFromDeckEvent(Long gameId,
                                Long playerId) implements Event {

    public EventType type() {
        return EventType.TAKE_FROM_DECK;
    }
}
