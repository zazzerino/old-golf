package com.kdp.golf.game.logic;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.kdp.golf.Util;

import java.util.*;

public class Hand {

    private final List<Card> cards;
    private final Set<Integer> uncoveredIndices;

    public static final int HAND_SIZE = 6;

    public Hand() {
        cards = new ArrayList<>();
        uncoveredIndices = new HashSet<>();
    }

    public Hand(List<Card> cards, Set<Integer> coveredCards) {
        this.cards = cards;
        this.uncoveredIndices = coveredCards;
    }

    @JsonProperty
    public List<Card> cards() {
        return cards;
    }

    @JsonProperty
    public Set<Integer> uncoveredIndices() {
        return uncoveredIndices;
    }

    public Hand uncover(int index) {
        uncoveredIndices.add(index);
        return this;
    }

    public boolean allUncovered() {
        return uncoveredIndices.size() == HAND_SIZE;
    }

    public Hand addAll(List<Card> cards) {
        this.cards.addAll(cards);
        return this;
    }

    public Card cardAtIndex(int index) {
        assert(index >= 0 && index < 6);
        return cards.get(index);
    }

    public Hand setCardAtIndex(int index, Card card) {
        cards.set(index, card);
        return this;
    }

    public boolean isEmpty() {
        return cards.isEmpty();
    }

    @JsonProperty
    public int visibleScore() {
        var score = 0;

        if (cards.isEmpty()) {
            return score;
        }

        var ranks = cards.stream().map(Card::rank).toList();
        Map<Integer, Card> uncoveredCards = new HashMap<>();

        for (var i : uncoveredIndices) {
            var card = cards.get(i);
            uncoveredCards.put(i, card);
        }

        // check all six

        // check outer four
        var outerIndices = List.of(0, 2, 3, 5);

        if (uncoveredCards.keySet().containsAll(outerIndices)
                && Util.indicesEqual(ranks, outerIndices)) {
            score -= 50;
            Util.removeKeys(uncoveredCards, outerIndices);
        }

        // check left four

        // check right four

        // check left column
        var leftCol = List.of(0, 3);

        if (uncoveredCards.keySet().containsAll(leftCol)
            && Util.indicesEqual(ranks, leftCol)) {
            Util.removeKeys(uncoveredCards, leftCol);
        }

        // check middle column
        var middleCol = List.of(1, 4);

        if (uncoveredCards.keySet().containsAll(middleCol)
                && Util.indicesEqual(ranks, middleCol)) {
            Util.removeKeys(uncoveredCards, middleCol);
        }

        // check right column
        var rightCol = List.of(2, 5);

        if (uncoveredCards.keySet().containsAll(rightCol)
                && Util.indicesEqual(ranks, rightCol)) {
            Util.removeKeys(uncoveredCards, rightCol);
        }

        // sum remaining cards
        for (var card : uncoveredCards.values()) {
            score += card.golfValue();
        }

        return score;
    }

    @JsonProperty
    public int score() {
        if (cards.isEmpty()) {
            return 0;
        }

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
            var leftVals = leftRanks.stream().map(Card.Rank::golfValue).toList();
            score += Util.sumInt(leftVals);
        }

        if (!Util.allEqual(middleRanks)) {
            var middleVals = middleRanks.stream().map(Card.Rank::golfValue).toList();
            score += Util.sumInt(middleVals);
        }

        if (!Util.allEqual(rightRanks)) {
            var rightVals = rightRanks.stream().map(Card.Rank::golfValue).toList();
            score += Util.sumInt(rightVals);
        }

        return score;
    }

    @Override
    public String toString() {
        return "Hand{" +
                "cards=" + cards +
                ", uncoveredCards=" + uncoveredIndices +
                '}';
    }
}
