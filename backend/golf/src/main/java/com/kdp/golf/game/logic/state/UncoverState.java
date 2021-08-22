package com.kdp.golf.game.logic.state;

import com.kdp.golf.game.logic.card.CardLocation;
import com.kdp.golf.game.logic.Game;
import com.kdp.golf.game.logic.event.Event;
import com.kdp.golf.game.logic.event.UncoverEvent;

import java.util.List;

public class UncoverState implements State {
    private static UncoverState instance;

    private UncoverState() {}

    public static UncoverState instance() {
        if (instance == null) {
            instance = new UncoverState();
        }
        return instance;
    }

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
                game.setState(TakeState.instance());
            }
        }

        return game;
    }

    @Override
    public List<CardLocation> playableCards(Game game) {
        return List.of(
                CardLocation.H0,
                CardLocation.H1,
                CardLocation.H2,
                CardLocation.H3,
                CardLocation.H4,
                CardLocation.H5);
    }
}
