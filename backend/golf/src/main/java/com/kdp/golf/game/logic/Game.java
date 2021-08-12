package com.kdp.golf.game.logic;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.kdp.golf.game.logic.actions.*;

import java.util.*;

public class Game {

    public final Long id;

    private final Deck deck = new Deck(DECK_COUNT);
    private final Map<Long, Player> players = new HashMap<>();
    private final List<Long> playerOrder = new ArrayList<>();

    private int turn;
    private Long hostId;
    private State state;
    private Card tableCard;

    public final static int HAND_SIZE = 6;
    public final static int DECK_COUNT = 2; // the game is played with two decks

    enum State {
        INIT,
        PICKUP,
        DISCARD,
        FINAL_PICKUP,
        FINAL_DISCARD,
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

        state = State.PICKUP;
        return this;
    }

    public Game dealStartingHands() {
        for (var player : players.values()) {
            var cards = deck.deal(HAND_SIZE).orElseThrow();
            player.giveCards(cards);
        }

        return this;
    }

    public Game dealTableCard() {
        tableCard =  deck.deal().orElseThrow();
        return this;
    }

    public List<Card> getPlayerHand(Long playerId) {
        return players.get(playerId).getCards();
    }

    public Game takeFromDeck(Long playerId) {
        var player = players.get(playerId);
        var deckCard = deck.deal().orElseThrow();

        player.setHeldCard(deckCard);
        state = State.DISCARD;

        return this;
    }

    public Game takeFromTable(Long playerId) {
        var player = players.get(playerId);
        player.setHeldCard(tableCard);

        tableCard = deck.deal().orElseThrow();
        state = State.DISCARD;

        return this;
    }

    public Game discard(Long playerId) {
        var player = players.get(playerId);
        tableCard = player.getHeldCard().orElseThrow();
        player.setHeldCard(null);

        state = State.PICKUP;
        turn++;

        return this;
    }

    public Game swapCard(Long playerId, int index) {
        var player = players.get(playerId);
        var hand = player.getCards();
        var heldCard = player.getHeldCard().orElseThrow();

        tableCard = hand.get(index);
        hand.set(index, heldCard);
        player.setHeldCard(null);

        state = State.PICKUP;
        turn++;

        return this;
    }

    public Game handleAction(Action action) {
        if (action instanceof TakeFromDeckAction a) {
            takeFromDeck(a.playerId());
        } else if (action instanceof TakeFromTableAction a) {
            takeFromTable(a.playerId());
        } else if (action instanceof DiscardAction a) {
            discard(a.playerId());
        } else if (action instanceof SwapCardAction a) {
            swapCard(a.playerId(), a.index());
        } else {
            throw new UnsupportedOperationException();
        }

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
