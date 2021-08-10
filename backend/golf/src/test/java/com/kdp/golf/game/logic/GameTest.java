package com.kdp.golf.game.logic;

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

        assertEquals(Game.State.TURN, game.getState());
        assertTrue(game.getTableCard().isPresent());

        var hand = game.getPlayerHand(0L);
        assertFalse(hand.isEmpty());
        assertEquals(6, hand.size());
    }

//    @Test
//    void handleTurn() {
//        var player = new Player(0L, "Alice");
//        var game = new Game(0L, player);
//        game.start();
//
//        log.info(game);
//        assertEquals(0, game.getTurn());
//
//        game.handleTurn(0L, Game.CardSource.TABLE, 0);
//        log.info(game);
//    }
}
