package com.kdp.golf.game.logic.actions;

public record SwapCardAction(Long gameId,
                             Long playerId,
                             int handIndex) implements Action {

    public Type type() {
        return Type.SWAP_CARD;
    }
}
