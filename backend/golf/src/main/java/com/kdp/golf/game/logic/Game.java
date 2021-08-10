package com.kdp.golf.game.logic;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.*;

public class Game {

    public final Long id;

    private final Deck deck = new Deck(DECK_COUNT);
    private final Map<Long, Player> players = new HashMap<>();
    private final List<Long> playerOrder = new ArrayList<>();

    private Long hostId;
    private Card tableCard;
    private State state;
    private int turn;

    public final static int HAND_SIZE = 6;
    public final static int DECK_COUNT = 2; // the game is played with two decks

    enum State {
        INIT,
        TURN,
        FINAL_TURN,
        GAME_OVER
    }

    public Game(Long id, Player host) {
        this.id = id;
        this.state = State.INIT;
        this.turn = 0;
        this.hostId = host.id;

        addPlayer(host);
    }

    public Game start() {
        deck.shuffle();
        dealStartingHands();
        dealTableCard();

        state = State.TURN;
        return this;
    }

    public Game dealStartingHands() {
        for (var player : players.values()) {
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

    public List<Card> getPlayerHand(Long playerId) {
        return players.get(playerId).getCards();
    }

    public Game takeTableCard(Long playerId, int cardIndex) {
        var hand = getPlayerHand(playerId);
        var discard = hand.get(cardIndex);

        hand.set(cardIndex, tableCard);
        tableCard = discard;
        turn++;

        return this;
    }

    public Game takeDeckCard(Long playerId, int cardIndex) {
        var hand = getPlayerHand(playerId);
        var discard = hand.get(cardIndex);
        var deckCard = deck.deal().orElseThrow();

        hand.set(cardIndex, deckCard);
        tableCard = discard;
        turn++;

        return this;
    }

    public Game discardDeckCard(Long playerId) {
        tableCard = deck.deal().orElseThrow();
        turn++;

        return this;
    }

    @JsonProperty
    public Long playerTurn() {
        var index = turn % players.size();
        return playerOrder.get(index);
    }

    public Game addPlayer(Player player) {
        players.put(player.id, player);
        playerOrder.add(player.id);
        return this;
    }

    public Game removePlayer(Player player) {
        players.remove(player.id);
        playerOrder.remove(player.id);
        return this;
    }

    public Collection<Player> getPlayers() {
        return players.values();
    }

    public Long getHostId() {
        return hostId;
    }

    public void setHostId(Long hostId) {
        this.hostId = hostId;
    }

    @JsonIgnore
    public Deck getDeck() {
        return deck;
    }

    public Optional<Card> getTableCard() {
        return Optional.ofNullable(tableCard);
    }

    public Optional<Card> getDeckCard() {
        return Optional.ofNullable(deck.getCards().get(0));
    }

    @JsonProperty
    public boolean hasStarted() {
        return state != State.INIT;
    }

    public State getState() {
        return state;
    }

    public int getTurn() {
        return turn;
    }

    @Override
    public String toString() {
        return "Game{" +
                "id=" + id +
                ", hostId=" + hostId +
                ", players=" + players +
                ", state=" + state +
                ", deck=" + deck +
                ", tableCard=" + tableCard +
                ", turn=" + turn +
                ", playerOrder=" + playerOrder +
                '}';
    }
}
