package com.kdp.golf.game.logic.actions;

public interface Action {

    enum Type {
        TAKE_FROM_DECK,
        TAKE_FROM_TABLE,
        SWAP_CARD,
        DISCARD,
        UNCOVER
    }

    Type type();
    Long gameId();
    Long playerId();
}
