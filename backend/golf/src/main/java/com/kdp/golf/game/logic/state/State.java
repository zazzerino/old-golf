package com.kdp.golf.game.logic.state;

import com.kdp.golf.game.logic.card.Card;
import com.kdp.golf.game.logic.Game;
import com.kdp.golf.game.logic.event.Event;

import java.util.List;

public interface State {

    Type type();

    default Game handleEvent(Game game, Event event) {
        return game;
    }

    default List<Card.Location> playableCards(Game game) {
        return List.of();
    };

    enum Type {
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
