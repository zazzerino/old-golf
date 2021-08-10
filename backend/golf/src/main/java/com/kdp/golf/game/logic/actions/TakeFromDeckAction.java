package com.kdp.golf.game.logic.actions;

public record TakeFromDeckAction(Long playerId) implements Action {

    public Type type() {
        return Type.TAKE_FROM_DECK;
    }
}
