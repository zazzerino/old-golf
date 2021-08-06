package com.kdp.golf.game.logic.actions;

public record ReturnDeckCard() implements TurnAction {

    public Type type() {
        return Type.RETURN_DECK_CARD;
    }
}
