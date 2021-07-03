package com.kdp.golf.game.logic;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class Game {

    public final Long id;
    private final List<Player> players = new ArrayList<>();
    private final @JsonIgnore Deck deck = new Deck(DECK_COUNT);
    private Long hostId;
    private Card tableCard;
    private @JsonProperty boolean hasStarted = false;

    public final static int HAND_SIZE = 6;
    public final static int DECK_COUNT = 2; // use two decks worth of cards

    public Game(Long id, Player host) {
        this.id = id;
        hostId = host.id;
        players.add(host);
    }

    public Game start() {
        deck.shuffle();
        dealStartingHands();
        dealTableCard();
        hasStarted = true;
        return this;
    }

    public Game dealStartingHands() {
        for (var player : players) {
            var cards = deck.deal(HAND_SIZE);

            if (cards.isEmpty()) {
                throw new IllegalStateException("deck is empty");
            }

            player.giveCards(cards.get());
        }

        return this;
    }

    public Game dealTableCard() {
        var card = deck.deal();

        if (card.isEmpty()) {
            throw new IllegalStateException("deck is empty");
        }

        tableCard = card.get();
        return this;
    }

    public Game addPlayer(Player player) {
        players.add(player);
        return this;
    }

    public Game removePlayer(Player player) {
        players.remove(player);
        return this;
    }

    public List<Player> getPlayers() {
        return players;
    }

    public Long getHostId() {
        return hostId;
    }

    public void setHostId(Long hostId) {
        this.hostId = hostId;
    }

    public Deck getDeck() {
        return deck;
    }

    public Optional<Card> getTableCard() {
        return Optional.ofNullable(tableCard);
    }

    public boolean hasStarted() {
        return hasStarted;
    }

    @Override
    public String toString() {
        return "Game{" +
                "id=" + id +
                ", hostId=" + hostId +
                ", players=" + players +
                ", deck=" + deck +
                ", tableCard=" + tableCard +
                '}';
    }
}
