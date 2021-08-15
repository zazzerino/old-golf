package com.kdp.golf.game.logic.event;

public record TakeFromTableEvent(Long gameId,
                                 Long playerId) implements Event {

    public EventType type() {
        return EventType.TAKE_FROM_TABLE;
    }
}
