package com.kdp.golf.game.logic.state;

import com.kdp.golf.game.logic.CardLocation;
import com.kdp.golf.game.logic.Game;
import com.kdp.golf.game.logic.event.Event;

import java.util.List;
import java.util.Map;

public interface GameState {
    StateType type();
    Game handleEvent(Game game, Event event);

    default Map<Long, List<CardLocation>> playableCards(Game game) {
        return Map.of();
    };

    enum StateType {
        INIT,
        UNCOVER_TWO,
        TAKE,
        DISCARD,
        UNCOVER,
        FINAL_TAKE,
        FINAL_DISCARD,
        GAME_OVER
    }
}
