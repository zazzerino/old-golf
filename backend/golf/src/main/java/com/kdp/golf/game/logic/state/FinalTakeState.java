package com.kdp.golf.game.logic.state;

import com.kdp.golf.game.logic.Game;
import com.kdp.golf.game.logic.card.Card;
import com.kdp.golf.game.logic.event.Event;
import com.kdp.golf.game.logic.event.TakeFromDeckEvent;
import com.kdp.golf.game.logic.event.TakeFromTableEvent;

import java.util.List;

public class FinalTakeState implements State {
    public static final FinalTakeState instance = new FinalTakeState();

    private FinalTakeState() {}

    @Override
    public Game handleEvent(Game game, Event event) {
        var playerId = event.playerId();

        if (game.isPlayersTurn(playerId)) {
            if (event instanceof TakeFromDeckEvent) {
                game.takeFromDeck(playerId);
                game.setState(FinalDiscardState.instance);
            } else if (event instanceof TakeFromTableEvent t) {
                game.takeFromTable(playerId);
                game.setState(FinalDiscardState.instance);
            }
        }

        return game;
    }

    @Override
    public List<Card.Location> playableCards(Game game) {
        return List.of(Card.Location.DECK, Card.Location.TABLE);
    }

    @Override
    public StateType type() {
        return StateType.FINAL_TAKE;
    }
}
