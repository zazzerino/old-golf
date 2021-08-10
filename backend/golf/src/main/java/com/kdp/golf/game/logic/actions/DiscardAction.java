package com.kdp.golf.game.logic.actions;

public record DiscardAction(Long playerId) implements Action {

    public Type type() {
        return Type.DISCARD;
    }
}
