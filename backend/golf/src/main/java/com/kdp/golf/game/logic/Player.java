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

    @JsonProperty
    public int score() {
        return hand.isEmpty() ? 0 : hand.score();
    }

    @JsonProperty
    public int visibleScore() {
//        if (hand.isEmpty()) {
//            return 0;
//        }
//
//        var covered = hand.getCoveredCards();
        return 0;
    }

//    public int uncoveredCardCount() {
//        return
//        var coveredCount = hand.uncoveredCards().size();
//        return Hand.HAND_SIZE - coveredCount;
//    }

    @Override
    public String toString() {
        return "Player{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", hand=" + hand +
                ", heldCard=" + heldCard +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Player player = (Player) o;
        return id.equals(player.id) && name.equals(player.name) && hand.equals(player.hand) && Objects.equals(heldCard, player.heldCard);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, hand, heldCard);
    }
}
