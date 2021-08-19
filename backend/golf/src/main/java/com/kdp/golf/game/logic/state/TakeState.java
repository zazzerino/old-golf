package com.kdp.golf.game.logic.state;

import com.kdp.golf.game.logic.card.CardLocation;
import com.kdp.golf.game.logic.Game;
import com.kdp.golf.game.logic.event.Event;
import com.kdp.golf.game.logic.event.TakeFromDeckEvent;
import com.kdp.golf.game.logic.event.TakeFromTableEvent;

import java.util.List;
import java.util.Map;

public class TakeState implements GameState {
    private static TakeState instance;

    private TakeState() {}

    public static TakeState instance() {
        if (instance == null) {
            instance = new TakeState();
        }
        return instance;
    }

    @Override
    public StateType type() {
        return StateType.TAKE;
    }

    @Override
    public Game handleEvent(Game game, Event event) {
        var playerId = event.playerId();

        if (game.isPlayersTurn(playerId)) {
            if (event instanceof TakeFromDeckEvent) {
                game.takeFromDeck(playerId);
                game.setState(DiscardState.instance());
            } else if (event instanceof TakeFromTableEvent) {
                game.takeFromTable(playerId);
                game.setState(DiscardState.instance());
            }
        }

        return game;
    }

    @Override
    public List<CardLocation> playableCards(Game game) {
        return List.of(CardLocation.DECK, CardLocation.TABLE);
    }
}
