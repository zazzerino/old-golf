package com.kdp.golf.game.logic.state;

import com.kdp.golf.game.logic.card.CardLocation;
import com.kdp.golf.game.logic.Game;
import com.kdp.golf.game.logic.Player;
import com.kdp.golf.game.logic.event.Event;
import com.kdp.golf.game.logic.event.UncoverEvent;

import java.util.List;
import java.util.function.Predicate;

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

        Predicate<Player> ready = p -> p.uncoveredCardCount() == 2;
        var allReady = game.getPlayers().stream().allMatch(ready);

        if (allReady) {
            game.setState(TakeState.instance());
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
