package com.kdp.golf.game.logic.event;

public record TakeFromTableEvent(Long gameId,
                                 Long playerId) implements Event {

    public Type type() {
        return Type.TAKE_FROM_TABLE;
    }
}
