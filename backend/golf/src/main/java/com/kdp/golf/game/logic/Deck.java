package com.kdp.golf.game.logic;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

public class Deck {

    private final List<Card> cards;

    public Deck() {
        cards = cardList();
    }

    public Deck(List<Card> cards) {
        this.cards = cards;
    }

    public Deck(int deckCount) {
        List<Card> cards = new ArrayList<>();

        for (int i = 0; i < deckCount; i++) {
            cards.addAll(cardList());
        }

        this.cards = cards;
    }

    public static List<Card> cardList() {
        List<Card> cards = new ArrayList<>();

        for (var suit : Card.Suit.values()) {
            for (var rank : Card.Rank.values()) {
                cards.add(new Card(rank, suit));
            }
        }

        return cards;
    }

    public List<Card> getCards() {
        return cards;
    }

    public Deck shuffle() {
        Collections.shuffle(cards);
        return this;
    }

    public Optional<Card> deal() {
        if (cards.isEmpty()) {
            return Optional.empty();
        }

        var card = cards.get(0);
        cards.remove(card);

        return Optional.of(card);
    }

    public Optional<List<Card>> deal(int n) {
        if (cards.size() < n) {
            return Optional.empty();
        }

        List<Card> dealtCards = new ArrayList<>();

        for (int i = 0; i < n; i++) {
            dealtCards.add(cards.get(0));
            cards.remove(0);
        }

        return Optional.of(dealtCards);
    }

    @Override
    public String toString() {
        return "Deck{" +
                "cards=" + cards +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Deck deck = (Deck) o;
        return cards.equals(deck.cards);
    }

    @Override
    public int hashCode() {
        return Objects.hash(cards);
    }
}
