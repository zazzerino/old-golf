package com.kdp.golf.game.logic.state;

import com.kdp.golf.game.logic.card.Card;
import com.kdp.golf.game.logic.Game;
import com.kdp.golf.game.logic.event.Event;
import com.kdp.golf.game.logic.event.UncoverEvent;

import java.util.List;

public class UncoverState implements State {
    public static final UncoverState instance = new UncoverState();

    private UncoverState() {}

    @Override
    public StateType type() {
        return StateType.UNCOVER;
    }

    @Override
    public Game handleEvent(Game game, Event event) {
        var playerId = event.playerId();

        if (game.isPlayersTurn(playerId)) {
            if (event instanceof UncoverEvent u) {
                game.uncover(playerId, u.handIndex());
                game.nextTurn();
                game.setState(TakeState.instance);
            }
        }

        return game;
    }

    @Override
    public List<Card.Location> playableCards(Game game) {
        return List.of(
                Card.Location.H0,
                Card.Location.H1,
                Card.Location.H2,
                Card.Location.H3,
                Card.Location.H4,
                Card.Location.H5);
    }
}
