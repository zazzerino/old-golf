package com.kdp.golf.game.logic.state;

import com.kdp.golf.game.logic.card.Card;
import com.kdp.golf.game.logic.Game;
import com.kdp.golf.game.logic.event.Event;
import com.kdp.golf.game.logic.event.TakeFromDeckEvent;
import com.kdp.golf.game.logic.event.TakeFromTableEvent;

import java.util.List;

public class TakeState implements State {
    public static final TakeState instance = new TakeState();

    private TakeState() {}

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
                game.setState(DiscardState.instance);
            } else if (event instanceof TakeFromTableEvent) {
                game.takeFromTable(playerId);
                game.setState(DiscardState.instance);
            }
        }

        return game;
    }

    @Override
    public List<Card.Location> playableCards(Game game) {
        return List.of(Card.Location.DECK, Card.Location.TABLE);
    }
}
