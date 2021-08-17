package com.kdp.golf.game.logic;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.kdp.golf.user.User;

import java.util.*;

public class Player {

    public final Long id;
    public final String name;
    private final Hand hand;
    private Card heldCard;

    public Player(Long id, String name, Hand hand) {
        this.id = id;
        this.name = name;
        this.hand = hand;
    }

    public Player(Long id, String name) {
        this.id = id;
        this.name = name;
        this.hand = new Hand();
    }

    public static Player from(User user) {
        return new Player(user.id, user.getName());
    }

    @JsonProperty
    public Hand hand() {
        return hand;
    }

    @JsonProperty
    public Optional<Card> heldCard() {
        return Optional.ofNullable(heldCard);
    }

    public Player setHeldCard(Card card) {
        heldCard = card;
        return this;
    }

    public Player giveCards(List<Card> cards) {
        hand.addAll(cards);
        return this;
    }

    public int uncoveredCardCount() {
        return hand.uncoveredIndices().size();
    }

    @Override
    public String toString() {
        return "Player{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", hand=" + hand +
                ", heldCard=" + heldCard +
                '}';
    }
}
