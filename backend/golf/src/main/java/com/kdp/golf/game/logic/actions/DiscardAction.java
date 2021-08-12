package com.kdp.golf.game.logic.actions;

public record DiscardAction(Long gameId,
                            Long playerId) implements Action {

    public Type type() {
        return Type.DISCARD;
    }
}
