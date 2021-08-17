package com.kdp.golf.game.logic.state;

import com.kdp.golf.game.logic.CardLocation;
import com.kdp.golf.game.logic.Game;
import com.kdp.golf.game.logic.event.Event;
import com.kdp.golf.game.logic.event.UncoverEvent;

import java.util.List;
import java.util.Map;

public class UncoverState implements GameState {
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
    public Map<Long, List<CardLocation>> playableCards(Game game) {
        return Map.of();
//        return List.of(
//                CardLocation.HAND0,
//                CardLocation.HAND1,
//                CardLocation.HAND2,
//                CardLocation.HAND3,
//                CardLocation.HAND4,
//                CardLocation.HAND5);
    }
}
