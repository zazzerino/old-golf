package com.kdp.golf.game.logic.actions;

public interface TurnAction {

    enum Type {
        TAKE_TABLE_CARD,
        TAKE_DECK_CARD,
        RETURN_DECK_CARD
    }

    Type type();
}
