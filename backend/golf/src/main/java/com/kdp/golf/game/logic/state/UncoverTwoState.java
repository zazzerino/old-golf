package com.kdp.golf.game.logic.state;

import com.kdp.golf.game.logic.Game;
import com.kdp.golf.game.logic.event.Event;
import com.kdp.golf.game.logic.event.UncoverEvent;

public class UncoverTwoState implements GameState {
    private static UncoverTwoState instance;

    private UncoverTwoState() {}

    public static UncoverTwoState instance() {
        if (instance == null) {
            instance = new UncoverTwoState();
        }
        return instance;
    }

    @Override
    public StateType type() {
        return StateType.UNCOVER_TWO;
    }

    @Override
    public Game handleEvent(Game game, Event event) {
        var playerId = event.playerId();
        var player = game.getPlayer(playerId).orElseThrow();
        var stillUncovering = player.uncoveredCardCount() < 2;

        if (event instanceof UncoverEvent u
                && stillUncovering) {
            game.uncover(playerId, u.handIndex());
        }

        var allReady = game.players()
                .stream()
                .allMatch(p -> p.uncoveredCardCount() == 2);

        if (allReady) {
            game.setState(TakeState.instance());
        }

        return game;
    }
}
