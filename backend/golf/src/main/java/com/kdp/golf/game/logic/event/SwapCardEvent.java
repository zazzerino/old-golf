package com.kdp.golf.game.logic.event;

public record SwapCardEvent(Long gameId,
                            Long playerId,
                            int handIndex) implements Event {

    public Type type() {
        return Type.SWAP_CARD;
    }
}
