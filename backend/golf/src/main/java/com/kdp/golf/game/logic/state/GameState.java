package com.kdp.golf.game.logic.state;

import com.kdp.golf.game.logic.Card;
import com.kdp.golf.game.logic.CardLocation;
import com.kdp.golf.game.logic.Game;
import com.kdp.golf.game.logic.event.Event;

import java.util.List;

public interface GameState {
    StateType type();
    Game handleEvent(Game game, Event event);

    default List<CardLocation> playableCards(Game game) {
        return List.of();
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
