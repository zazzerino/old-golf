package com.kdp.golf.game.logic.actions;

public record TakeTableCard() implements TurnAction {

    public Type type() {
        return Type.TAKE_TABLE_CARD;
    }
}
