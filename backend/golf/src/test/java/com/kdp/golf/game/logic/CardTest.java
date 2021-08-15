package com.kdp.golf.game.logic;

import io.quarkus.test.junit.QuarkusTest;
import org.jboss.logging.Logger;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
class CardTest {
    Logger log = Logger.getLogger("CardTest");

    @Test
    void from() {
        var rank = Card.Rank.from("2");
        assertEquals(Card.Rank.TWO, rank.orElseThrow());

        var suit = Card.Suit.from("D");
        assertEquals(Card.Suit.DIAMONDS, suit.orElseThrow());

        var card = Card.from("JH");
        assertEquals(new Card(Card.Rank.JACK, Card.Suit.HEARTS), card);
    }
}
