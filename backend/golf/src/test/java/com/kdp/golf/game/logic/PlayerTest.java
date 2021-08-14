package com.kdp.golf.game.logic;

import io.quarkus.test.junit.QuarkusTest;
import org.jboss.logging.Logger;
import org.junit.jupiter.api.Test;

import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
class PlayerTest {

    Logger log = Logger.getLogger("PlayerTest");

    @Test
    void score() {
        var player = new Player(0L, "Bob");

        var noMatches = Stream.of("2C", "3C", "4C", "5C", "6C", "7C")
                .map(Card::from)
                .toList();

        player.setCards(noMatches);

        var score0 = player.score();
        assertEquals(27, score0);
    }
}