package com.kdp.golf.game;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public record Deck(List<Card> cards) {

    public static Deck create() {
        List<Card> cards = new ArrayList<>();

        for (var suit : Card.Suit.values()) {
            for (var rank : Card.Rank.values()) {
                cards.add(new Card(suit, rank));
            }
        }

        return new Deck(cards);
    }

    public Deck shuffle() {
        List<Card> cardsCopy = new ArrayList<>(cards.size());

        Collections.copy(cardsCopy, cards);
        Collections.shuffle(cardsCopy);

        return new Deck(cardsCopy);
    }

    record DealResult(List<Card> dealtCards, Deck deck) {}

    public DealResult deal(int n) {
        List<Card> dealtCards = cards().stream()
                .limit(n)
                .toList();

        List<Card> remainingCards = cards.stream()
                .skip(n)
                .toList();

        var deck = new Deck(remainingCards);

        return new DealResult(dealtCards, deck);
    }
}
