package com.kdp.golf.game.logic.state;

import com.kdp.golf.game.logic.Game;
import com.kdp.golf.game.logic.event.Event;
import com.kdp.golf.game.logic.event.TakeFromDeckEvent;
import com.kdp.golf.game.logic.event.TakeFromTableEvent;

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
        var isPlayersTurn = game.playerTurn().equals(playerId);

        if (isPlayersTurn) {
            if (event instanceof TakeFromDeckEvent) {
                game.takeFromDeck(playerId);
            } else if (event instanceof TakeFromTableEvent) {
                game.takeFromTable(playerId);
            }
        }

        return game;
    }
}
