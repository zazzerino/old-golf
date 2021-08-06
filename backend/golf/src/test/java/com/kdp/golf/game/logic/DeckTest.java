package com.kdp.golf.game.logic;

import io.quarkus.test.junit.QuarkusTest;
import org.jboss.logging.Logger;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
class DeckTest {
    Logger log = Logger.getLogger(DeckTest.class);

    @Test
    void create() {
        var deck = new Deck();
        assertEquals(52, deck.getCards().size());
    }

    @Test
    void deal() {
        var deck = new Deck();
        var firstCard = deck.getCards().get(0);
        var dealtCard = deck.deal();

        if (dealtCard.isEmpty()) {
            throw new IllegalStateException();
        }

        assertEquals(51, deck.getCards().size());
        assertEquals(firstCard, dealtCard.get());
    }

    @Test
    void createMultiple() {
        var deck = new Deck(2);
        assertEquals(104, deck.getCards().size());
    }
}
