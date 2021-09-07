package com.kdp.golf.game.logic.state;

import com.kdp.golf.game.logic.card.Card;
import com.kdp.golf.game.logic.Game;
import com.kdp.golf.game.logic.Hand;
import com.kdp.golf.game.logic.event.DiscardEvent;
import com.kdp.golf.game.logic.event.Event;
import com.kdp.golf.game.logic.event.SwapCardEvent;

import java.util.List;

public class DiscardState implements State {
    public static final DiscardState instance = new DiscardState();

    private DiscardState() {}

    @Override
    public Type type() {
        return Type.DISCARD;
    }

    @Override
    public Game handleEvent(Game game, Event event) {
        var playerId = event.playerId();
        var player = game.getPlayer(playerId).orElseThrow();

        if (!game.isPlayersTurn(playerId)) {
            return game;
        }

        if (event instanceof DiscardEvent) {
            game.discard(playerId);
            var oneCardLeft = player.uncoveredCardCount() == Hand.HAND_SIZE - 1;

            if (oneCardLeft) {
                game.setState(TakeState.instance);
                game.nextTurn();
            } else {
                game.setState(UncoverState.instance);
            }
        } else if (event instanceof SwapCardEvent s) {
            game.swapCard(playerId, s.handIndex());

            if (player.getHand().allUncovered()) {
                game.setState(FinalTakeState.instance);
            } else {
                game.setState(TakeState.instance);
            }

            game.nextTurn();

            var allFlipped = game.getPlayers().stream()
                    .allMatch(p -> p.getHand().allUncovered());

            if (allFlipped) {
                game.setState(GameOverState.instance);
            }
        }

        return game;
    }

    @Override
    public List<Card.Location> playableCards(Game game) {
        return List.of(
                Card.Location.HELD,
                Card.Location.H0,
                Card.Location.H1,
                Card.Location.H2,
                Card.Location.H3,
                Card.Location.H4,
                Card.Location.H5);
    }
}
