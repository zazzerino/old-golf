package com.kdp.golf.game.logic.state;

import com.kdp.golf.game.logic.card.Card;
import com.kdp.golf.game.logic.Game;
import com.kdp.golf.game.logic.event.Event;
import com.kdp.golf.game.logic.event.UncoverEvent;

import java.util.List;

public class UncoverTwoState implements State {
    public static final UncoverTwoState instance = new UncoverTwoState();

    private UncoverTwoState() {}

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

        var allReady = game.getPlayers().stream().allMatch(p -> p.uncoveredCardCount() == 2);

        if (allReady) {
            game.setState(TakeState.instance);
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
