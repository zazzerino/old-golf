package com.kdp.golf.game.logic;

import com.kdp.golf.game.logic.card.Card;
import com.kdp.golf.user.User;

import java.util.*;

public class Player {

    public final Long id;
    private final Hand hand;
    private String name;
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

    public String getName() {
        return name;
    }

    public Player setName(String name) {
        this.name = name;
        return this;
    }

    public Hand getHand() {
        return hand;
    }

    public Optional<Card> getHeldCard() {
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
        return hand.uncoveredCards().size();
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
