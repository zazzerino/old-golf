package com.kdp.golf.game.logic.actions;

public record TakeFromTableAction(Long gameId,
                                  Long playerId) implements Action {

    public Type type() {
        return Type.TAKE_FROM_TABLE;
    }
}
