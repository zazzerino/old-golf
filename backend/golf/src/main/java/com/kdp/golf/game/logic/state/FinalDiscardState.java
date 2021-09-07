package com.kdp.golf.game.logic.state;

import com.kdp.golf.game.logic.Game;
import com.kdp.golf.game.logic.card.Card;
import com.kdp.golf.game.logic.event.DiscardEvent;
import com.kdp.golf.game.logic.event.Event;
import com.kdp.golf.game.logic.event.SwapCardEvent;

import java.util.List;

public class FinalDiscardState implements State {
    public static final FinalDiscardState instance = new FinalDiscardState();

    private FinalDiscardState() {}

    @Override
    public Game handleEvent(Game game, Event event) {
        var playerId = event.playerId();
        var player = game.getPlayer(playerId).orElseThrow();

        if (game.isPlayersTurn(playerId)) {
            if (event instanceof DiscardEvent) {
                game.discard(playerId);
                player.getHand().uncoverAll();

                var gameOver = game.getPlayers().stream()
                        .allMatch(p -> p.getHand().allUncovered());

                if (gameOver) {
                    game.setState(GameOverState.instance);
                } else {
                    game.nextTurn();
                    game.setState(FinalTakeState.instance);
                }
            } else if (event instanceof SwapCardEvent s) {
                game.swapCard(playerId, s.handIndex());
                player.getHand().uncoverAll();

                var gameOver = game.getPlayers().stream()
                        .allMatch(p -> p.getHand().allUncovered());

                if (gameOver) {
                    game.setState(GameOverState.instance);
                } else {
                    game.nextTurn();
                    game.setState(FinalTakeState.instance);
                }
            }
        }

        return game;
    }

    @Override
    public Type type() {
        return Type.FINAL_DISCARD;
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
