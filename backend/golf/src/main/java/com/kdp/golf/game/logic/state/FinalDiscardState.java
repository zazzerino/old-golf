package com.kdp.golf.game.logic.state;

import com.kdp.golf.game.logic.Game;
import com.kdp.golf.game.logic.event.DiscardEvent;
import com.kdp.golf.game.logic.event.Event;
import com.kdp.golf.game.logic.event.SwapCardEvent;

public class FinalDiscardState implements GameState {
    private static FinalDiscardState instance;

    private FinalDiscardState() {}

    public static FinalDiscardState instance() {
        if (instance == null) {
            instance = new FinalDiscardState();
        }
        return null;
    }

    @Override
    public Game handleEvent(Game game, Event event) {
        var playerId = event.playerId();
        var player = game.getPlayer(playerId).orElseThrow();

        if (game.isPlayersTurn(playerId)) {
            if (event instanceof DiscardEvent) {
                game.discard(playerId);
                player.hand().uncoverAll();

                var gameOver = game.getPlayers().stream()
                        .allMatch(p -> p.hand().allUncovered());

                if (gameOver) {
                    game.setState(GameOverState.instance());
                } else {
                    game.nextTurn();
                    game.setState(FinalTakeState.instance());
                }
            } else if (event instanceof SwapCardEvent s) {
                game.swapCard(playerId, s.handIndex());
                player.hand().uncoverAll();

                var gameOver = game.getPlayers().stream()
                        .allMatch(p -> p.hand().allUncovered());

                if (gameOver) {
                    game.setState(GameOverState.instance());
                } else {
                    game.nextTurn();
                    game.setState(FinalTakeState.instance());
                }
            }
        }

        return game;
    }

    @Override
    public StateType type() {
        return null;
    }
}
