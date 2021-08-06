package com.kdp.golf.game.logic.actions;

public record TakeDeckCard() implements TurnAction {

    public Type type() {
        return Type.TAKE_DECK_CARD;
    }
}
