package com.kdp.golf.game.logic.actions;

public record SwapCardAction(Long gameId,
                             Long playerId,
                             int index) implements Action {

    public Type type() {
        return Type.SWAP_CARD;
    }
}
