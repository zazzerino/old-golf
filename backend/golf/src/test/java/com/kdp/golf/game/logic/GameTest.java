package com.kdp.golf.game.logic;

import com.kdp.golf.game.logic.event.DiscardEvent;
import com.kdp.golf.game.logic.event.SwapCardEvent;
import com.kdp.golf.game.logic.event.TakeFromDeckEvent;
import com.kdp.golf.game.logic.event.TakeFromTableEvent;
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
        assertEquals(6, hand.cards().size());
    }

    @Test
    void takeFromDeck() {
        var playerId = 2L;
        var player = new Player(playerId, "Alice");

        var gameId = 8L;
        var game = new Game(gameId, player);

        game.start();
        log.info(game);

        var action = new TakeFromDeckEvent(gameId, playerId);
        game.handleEvent(action);
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

        var action = new TakeFromTableEvent(gameId, playerId);
        game.handleEvent(action);
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

        game.handleEvent(new TakeFromDeckEvent(gameId, playerId));
        log.info(game);

        game.handleEvent(new DiscardEvent(gameId, playerId));
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

        game.handleEvent(new TakeFromTableEvent(gameId, playerId));
        log.info(game);

        game.handleEvent(new SwapCardEvent(gameId, playerId, 0));
        log.info(game);
    }
}
