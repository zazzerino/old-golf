package com.kdp.golf.game.logic;

import com.kdp.golf.user.User;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;

public class Player {

    public final Long id;
    public final String name;
    private final List<Card> cards;

    public Player(Long id, String name, List<Card> cards) {
        this.id = id;
        this.name = name;
        this.cards = cards;
    }

    public Player(Long id, String name) {
        this.id = id;
        this.name = name;
        cards = new ArrayList<>();
    }

    public static Player from(User user) {
        return new Player(user.id, user.getName());
    }

    public List<Card> getCards() {
        return cards;
    }

    public Player giveCard(Card card) {
        cards.add(card);
        return this;
    }

    public Player giveCards(List<Card> cards) {
        this.cards.addAll(cards);
        return this;
    }

    public Card takeCard(Card card) {
        if (!cards.contains(card)) {
            throw new NoSuchElementException();
        }

        cards.remove(card);
        return card;
    }

    @Override
    public String toString() {
        return "Player{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", cards=" + cards +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Player player = (Player) o;
        return id.equals(player.id) && name.equals(player.name) && cards.equals(player.cards);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, cards);
    }
}
