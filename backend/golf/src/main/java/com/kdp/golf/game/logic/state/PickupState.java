package com.kdp.golf.game.logic.state;

import com.kdp.golf.game.logic.Game;
import com.kdp.golf.game.logic.event.Event;

public class PickupState implements GameState {
    private static PickupState instance;

    private PickupState() {
    }

    public static PickupState instance() {
        if (instance == null) {
            instance = new PickupState();
        }
        return instance;
    }

    @Override
    public StateType type() {
        return StateType.PICKUP;
    }

    @Override
    public Game handleEvent(Game game, Event event) {
        return game;
    }
}
