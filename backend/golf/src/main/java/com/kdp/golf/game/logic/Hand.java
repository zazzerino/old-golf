package com.kdp.golf.game.logic;

import com.kdp.golf.Util;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class Hand {

    private final List<Card> cards;
    private final Set<Integer> coveredCards;

    public static final int HAND_SIZE = 6;

    public Hand() {
        cards = new ArrayList<>();
        coveredCards = Stream.of(0, 1, 2, 3, 4, 5)
                .collect(Collectors.toSet());
    }

    public Hand(List<Card> cards, Set<Integer> coveredCards) {
        this.cards = cards;
        this.coveredCards = coveredCards;
    }

    public Hand uncover(int index) {
        coveredCards.remove(index);
        return this;
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

    public Set<Integer> getCoveredCards() {
        return coveredCards;
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
        var outerFourRanks = Util.pickItems(ranks, List.of(0, 2, 3, 5));
        if (Util.allEqual(outerFourRanks)) {
            var middleVals = Util.pickItems(values, List.of(1, 4));
            if (Util.allEqual(Util.pickItems(ranks, List.of(1, 4)))) {
                return -20;
            }
            return Util.sumInt(middleVals) - 20;
        }

        var leftFourRanks = Util.pickItems(ranks, List.of(0, 1, 3, 4));
        var rightFourRanks = Util.pickItems(ranks, List.of(1, 2, 4, 5));

        // left four match
        if (Util.allEqual(leftFourRanks)) {
            var rightVals = Util.pickItems(values, List.of(2, 5));
            if (Util.allEqual(Util.pickItems(ranks, List.of(2, 5)))) {
                return -10;
            }
            return Util.sumInt(rightVals) - 10;
        }

        // right four match
        if (Util.allEqual(rightFourRanks)) {
            var leftVals = Util.pickItems(values, List.of(0, 3));
            if (Util.allEqual(Util.pickItems(ranks, List.of(0, 3)))) {
                return -10;
            }
            return Util.sumInt(leftVals) - 10;
        }

        var score = 0;

        var leftRanks = Util.pickItems(ranks, List.of(0, 3));
        var middleRanks = Util.pickItems(ranks, List.of(1, 4));
        var rightRanks = Util.pickItems(ranks, List.of(2, 5));

        if (!Util.allEqual(leftRanks)) {
            var leftVals = leftRanks.stream().map(Card::golfValue).toList();
            score += Util.sumInt(leftVals);
        }

        if (!Util.allEqual(middleRanks)) {
            var middleVals = middleRanks.stream().map(Card::golfValue).toList();
            score += Util.sumInt(middleVals);
        }

        if (!Util.allEqual(rightRanks)) {
            var rightVals = rightRanks.stream().map(Card::golfValue).toList();
            score += Util.sumInt(rightVals);
        }

        return score;
    }
}
