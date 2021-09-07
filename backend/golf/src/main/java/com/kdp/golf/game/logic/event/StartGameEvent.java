package com.kdp.golf.game.logic.event;

public record StartGameEvent(Long gameId,
                             Long playerId) implements  Event {

    public Event.EventType type() {
        return Event.EventType.START_GAME;
    }
}
