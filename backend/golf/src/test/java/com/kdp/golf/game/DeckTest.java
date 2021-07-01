package com.kdp.golf.game;

import io.quarkus.test.junit.QuarkusTest;
import org.jboss.logging.Logger;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
class DeckTest {
    Logger log = Logger.getLogger(DeckTest.class);

    @Test
    void create() {
        var deck = Deck.create();
        assertEquals(52, deck.cards().size());
    }
}
