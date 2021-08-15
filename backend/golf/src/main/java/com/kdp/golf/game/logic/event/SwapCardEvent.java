package com.kdp.golf.game.logic.event;

public record SwapCardEvent(Long gameId,
                            Long playerId,
                            int handIndex) implements Event {

    public EventType type() {
        return EventType.SWAP_CARD;
    }
}
