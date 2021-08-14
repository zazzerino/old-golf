package com.kdp.golf.game.logic;

import com.kdp.golf.Util;
import com.kdp.golf.user.User;
import org.jboss.logging.Logger;

import java.util.*;

public class Player {

    Logger log = Logger.getLogger("Player");

    public final Long id;
    public final String name;

    private List<Card> cards;
    private Card heldCard;

    public static int HAND_SIZE = 6;

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

    public Player setCards(List<Card> cards) {
        this.cards = cards;
        return this;
    }

    public List<Card> getCards() {
        return cards;
    }

    public Optional<Card> getHeldCard() {
        return Optional.ofNullable(heldCard);
    }

    public Player setHeldCard(Card card) {
        heldCard = card;
        return this;
    }

    public Player giveCard(Card card) {
        cards.add(card);
        return this;
    }

    public Player giveCards(List<Card> cards) {
        this.cards.addAll(cards);
        return this;
    }

    public long score() {
        var ranks = cards.stream().map(Card::rank).toList();
        var values = cards.stream().map(Card::golfValue).toList();
        assert(values.size() == HAND_SIZE);

        // all six match

        // outer four match
        if (Objects.equals(ranks.get(0), ranks.get(2))
                && Objects.equals(ranks.get(0), ranks.get(3))
                && Objects.equals(ranks.get(0), ranks.get(5))) {
            log.info("outer four match");
            var middleVals = Util.pickItems(values, List.of(1, 4));
            return Util.sum(middleVals) - 20;
        }

        // left four match
        if (Objects.equals(ranks.get(0), ranks.get(3))
                && Objects.equals(ranks.get(0), ranks.get(1))
                && Objects.equals(ranks.get(1), ranks.get(4))) {
            log.info("left four match");
            var rightVals = Util.pickItems(values, List.of(2, 5));
            return Util.sum(rightVals) - 10;
        }

        // right four match
        if (Objects.equals(ranks.get(1), ranks.get(4))
                && Objects.equals(ranks.get(1), ranks.get(2))
                && Objects.equals(ranks.get(2), ranks.get(5))) {
            log.info("right four match");
            var leftVals = Util.pickItems(values, List.of(0, 3));
            return Util.sum(leftVals) - 10;
        }

        var score = 0;

        var leftRanks = Util.pickItems(ranks, List.of(0, 3));
        var middleRanks = Util.pickItems(ranks, List.of(1, 4));
        var rightRanks = Util.pickItems(ranks, List.of(2, 5));

        if (!Util.allEqual(leftRanks)) {
            log.info("left not equal");
            var vals = leftRanks.stream().map(Card::golfValue).toList();
            score += Util.sum(vals);
        }

        if (!Util.allEqual(middleRanks)) {
            log.info("middle not equal");
            var vals = middleRanks.stream().map(Card::golfValue).toList();
            score += Util.sum(vals);
        }

        if (!Util.allEqual(rightRanks)) {
            log.info("right not equal");
            var vals = rightRanks.stream().map(Card::golfValue).toList();
            score += Util.sum(vals);
        }

        return score;
    }

    @Override
    public String toString() {
        return "Player{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", cards=" + cards +
                ", heldCard=" + heldCard +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Player player = (Player) o;
        return id.equals(player.id) && name.equals(player.name) && cards.equals(player.cards) && Objects.equals(heldCard, player.heldCard);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, cards, heldCard);
    }
}
