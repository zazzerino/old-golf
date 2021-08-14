package com.kdp.golf.game;

import com.kdp.golf.Util;
import com.kdp.golf.game.logic.Card;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class Hand {

    private final List<Card> cards;

    public static final int HAND_SIZE = 6;

    public Hand() {
        cards = new ArrayList<>();
    }

    public Hand(List<Card> cards) {
        this.cards = cards;
    }

    public Hand add(Card card) {
        cards.add(card);
        return this;
    }

    public Hand addAll(List<Card> cards) {
        this.cards.addAll(cards);
        return this;
    }

    public List<Card> getCards() {
        return cards;
    }

    public Card get(int i) {
        assert(i >= 0 && i < 6);
        return cards.get(i);
    }

    public Hand set(int i, Card card) {
        cards.set(i, card);
        return this;
    }

    public boolean isEmpty() {
        return cards.isEmpty();
    }

    public int score() {
        var ranks = cards.stream().map(Card::rank).toList();
        var values = cards.stream().map(Card::golfValue).toList();
        assert(values.size() == HAND_SIZE);

        // all six match
        if (Util.allEqual(ranks)) {
            return -50;
        }

        // outer four match
        if (Objects.equals(ranks.get(0), ranks.get(2))
                && Objects.equals(ranks.get(0), ranks.get(3))
                && Objects.equals(ranks.get(0), ranks.get(5))) {
//            log.info("outer four match");
            var middleVals = Util.pickItems(values, List.of(1, 4));
            return Util.sumInt(middleVals) - 20;
        }

        // left four match
        if (Objects.equals(ranks.get(0), ranks.get(3))
                && Objects.equals(ranks.get(0), ranks.get(1))
                && Objects.equals(ranks.get(1), ranks.get(4))) {
//            log.info("left four match");
            var rightVals = Util.pickItems(values, List.of(2, 5));
            return Util.sumInt(rightVals) - 10;
        }

        // right four match
        if (Objects.equals(ranks.get(1), ranks.get(4))
                && Objects.equals(ranks.get(1), ranks.get(2))
                && Objects.equals(ranks.get(2), ranks.get(5))) {
//            log.info("right four match");
            var leftVals = Util.pickItems(values, List.of(0, 3));
            return Util.sumInt(leftVals) - 10;
        }

        var score = 0;

        var leftRanks = Util.pickItems(ranks, List.of(0, 3));
        var middleRanks = Util.pickItems(ranks, List.of(1, 4));
        var rightRanks = Util.pickItems(ranks, List.of(2, 5));

        if (!Util.allEqual(leftRanks)) {
//            log.info("left not equal");
            var vals = leftRanks.stream().map(Card::golfValue).toList();
            score += Util.sumInt(vals);
        }

        if (!Util.allEqual(middleRanks)) {
//            log.info("middle not equal");
            var vals = middleRanks.stream().map(Card::golfValue).toList();
            score += Util.sumInt(vals);
        }

        if (!Util.allEqual(rightRanks)) {
//            log.info("right not equal");
            var vals = rightRanks.stream().map(Card::golfValue).toList();
            score += Util.sumInt(vals);
        }

        return score;
    }
}
