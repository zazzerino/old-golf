package com.kdp.golf.game.logic.state;

import com.kdp.golf.game.logic.CardLocation;
import com.kdp.golf.game.logic.Game;
import com.kdp.golf.game.logic.Player;
import com.kdp.golf.game.logic.event.Event;
import com.kdp.golf.game.logic.event.UncoverEvent;

import java.util.List;
import java.util.Map;
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
        var allReady = game.players().stream().allMatch(ready);

        if (allReady) {
            game.setState(TakeState.instance());
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
