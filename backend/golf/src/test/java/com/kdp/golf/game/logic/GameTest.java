package com.kdp.golf.game.logic;

import com.kdp.golf.game.logic.actions.DiscardAction;
import com.kdp.golf.game.logic.actions.SwapCardAction;
import com.kdp.golf.game.logic.actions.TakeFromDeckAction;
import com.kdp.golf.game.logic.actions.TakeFromTableAction;
import io.quarkus.test.junit.QuarkusTest;
import org.jboss.logging.Logger;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
class GameTest {
    Logger log = Logger.getLogger(GameTest.class);

    @Test
    void create() {
        var player = new Player(0L, "Alice");
        var game = new Game(0L, player);

        log.info(game);
        assertEquals(Game.State.INIT, game.getState());
        assertEquals(104, game.getDeck().getCards().size());
        assertTrue(game.getTableCard().isEmpty());
    }

    @Test
    void start() {
        var player = new Player(0L, "Alice");
        var game = new Game(0L, player);
        game.start();

        assertEquals(Game.State.PICKUP, game.getState());
        assertTrue(game.getTableCard().isPresent());

        var hand = game.getPlayerHand(0L);
        assertFalse(hand.isEmpty());
        assertEquals(6, hand.size());
    }

    @Test
    void takeFromDeck() {
        var playerId = 2L;
        var player = new Player(playerId, "Alice");

        var gameId = 8L;
        var game = new Game(gameId, player);

        game.start();
        log.info(game);

        var action = new TakeFromDeckAction(gameId, playerId);
        game.handleAction(action);
        log.info(game);

        assertEquals(0, game.getTurn());
    }

    @Test
    void takeFromTable() {
        var playerId = 3L;
        var player = new Player(playerId, "Bob");

        var gameId = 23L;
        var game = new Game(gameId, player);

        game.start();
        log.info(game);

        var action = new TakeFromTableAction(gameId, playerId);
        game.handleAction(action);
        log.info(game);
    }

    @Test
    void discard() {
        var playerId = 4L;
        var player = new Player(playerId, "Charlie");

        var gameId = 32L;
        var game = new Game(gameId, player);

        game.start();
        log.info(game);

        game.handleAction(new TakeFromDeckAction(gameId, playerId));
        log.info(game);

        game.handleAction(new DiscardAction(gameId, playerId));
        log.info(game);
    }

    @Test
    void swapCard() {
        var playerId = 4L;
        var player = new Player(playerId, "Charlie");

        var gameId = 32L;
        var game = new Game(gameId, player);

        game.start();
        log.info(game);

        game.handleAction(new TakeFromTableAction(gameId, playerId));
        log.info(game);

        game.handleAction(new SwapCardAction(gameId, playerId, 0));
        log.info(game);
    }
}
