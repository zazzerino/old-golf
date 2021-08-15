package com.kdp.golf.game.logic.state;

import com.kdp.golf.game.logic.Game;
import com.kdp.golf.game.logic.event.Event;

public interface GameState {
    Game handleEvent(Game game, Event event);
    StateType type();

    enum StateType {
        INIT,
        UNCOVER_TWO,
        PICKUP,
        DISCARD,
        UNCOVER,
        UNCOVER_ALL,
        GAME_OVER
    }
}
