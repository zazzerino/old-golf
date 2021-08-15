package com.kdp.golf.game.logic;

import com.kdp.golf.game.logic.event.UncoverEvent;
import com.kdp.golf.game.logic.state.GameState;
import com.kdp.golf.game.logic.state.InitState;
import com.kdp.golf.game.logic.state.UncoverTwoState;
import io.quarkus.test.junit.QuarkusTest;
import org.jboss.logging.Logger;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
class GameTest {
    Logger log = Logger.getLogger(GameTest.class);

    @Test
    void uncoverTwo() {
        var gameId = 0L;
        var playerId = 2L;
        var player = new Player(playerId, "Alice");

        var game = new Game(gameId, player);
        assertTrue(game.state() instanceof InitState);

        game.start();
        assertTrue(game.state() instanceof UncoverTwoState);

        var event0 = new UncoverEvent(gameId, playerId, 0);
        game.handleEvent(event0);
        assertEquals(GameState.StateType.UNCOVER_TWO, game.stateType());

        var event1 = new UncoverEvent(gameId, playerId, 5);
        game.handleEvent(event1);
        assertEquals(GameState.StateType.TAKE, game.stateType());
    }

//    @Test
//    void create() {
//        var player = new Player(0L, "Alice");
//        var game = new Game(0L, player);
//
//        log.info(game);
//        assertEquals(Game.State.INIT, game.getState());
//        assertEquals(104, game.getDeck().getCards().size());
//        assertTrue(game.getTableCard().isEmpty());
//    }

//    @Test
//    void start() {
//        var player = new Player(0L, "Alice");
//        var game = new Game(0L, player);
//        game.start();
//
//        assertEquals(Game.State.INIT_UNCOVER, game.getState());
//        assertTrue(game.getTableCard().isPresent());
//
//        var hand = game.getPlayerHand(0L);
//        assertFalse(hand.isEmpty());
//        assertEquals(6, hand.cards().size());
//    }

//    @Test
//    void takeFromDeck() {
//        var playerId = 2L;
//        var player = new Player(playerId, "Alice");
//
//        var gameId = 8L;
//        var game = new Game(gameId, player);
//
//        game.start();
//        log.info(game);
//
//        var action = new TakeFromDeckEvent(gameId, playerId);
//        game.handleEvent(action);
//        log.info(game);
//
//        assertEquals(0, game.turn());
//    }
//
//    @Test
//    void takeFromTable() {
//        var playerId = 3L;
//        var player = new Player(playerId, "Bob");
//
//        var gameId = 23L;
//        var game = new Game(gameId, player);
//
//        game.start();
//        log.info(game);
//
//        var action = new TakeFromTableEvent(gameId, playerId);
//        game.handleEvent(action);
//        log.info(game);
//    }
//
//    @Test
//    void discard() {
//        var playerId = 4L;
//        var player = new Player(playerId, "Charlie");
//
//        var gameId = 32L;
//        var game = new Game(gameId, player);
//
//        game.start();
//        log.info(game);
//
//        game.handleEvent(new TakeFromDeckEvent(gameId, playerId));
//        log.info(game);
//
//        game.handleEvent(new DiscardEvent(gameId, playerId));
//        log.info(game);
//    }
//
//    @Test
//    void swapCard() {
//        var playerId = 4L;
//        var player = new Player(playerId, "Charlie");
//
//        var gameId = 32L;
//        var game = new Game(gameId, player);
//
//        game.start();
//        log.info(game);
//
//        game.handleEvent(new TakeFromTableEvent(gameId, playerId));
//        log.info(game);
//
//        game.handleEvent(new SwapCardEvent(gameId, playerId, 0));
//        log.info(game);
//    }
}
