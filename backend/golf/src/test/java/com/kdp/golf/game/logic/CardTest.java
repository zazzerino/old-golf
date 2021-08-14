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
        var suit = Card.Suit.from("D");
        var card = Card.from("JH");

        log.info(rank);
        log.info(suit);
        log.info(card);
    }
}