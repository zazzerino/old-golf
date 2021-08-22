package com.kdp.golf.game.logic.state;

import com.kdp.golf.game.logic.card.CardLocation;
import com.kdp.golf.game.logic.Game;
import com.kdp.golf.game.logic.event.Event;

import java.util.List;

public interface State {

    StateType type();

    default Game handleEvent(Game game, Event event) {
        return game;
    }

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
