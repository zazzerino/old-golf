package com.kdp.golf.game.logic.actions;

public record UncoverAction(Long gameId,
                            Long playerId,
                            int handIndex) implements Action {

    public Type type() {
        return Type.UNCOVER;
    }
}
