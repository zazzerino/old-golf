package com.kdp.golf.game.logic;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.kdp.golf.game.logic.card.Card;
import com.kdp.golf.game.logic.card.CardLocation;
import com.kdp.golf.game.logic.event.*;
import com.kdp.golf.game.logic.state.GameState;
import com.kdp.golf.game.logic.state.InitState;
import com.kdp.golf.game.logic.state.UncoverTwoState;

import java.util.*;

public class Game {

    public final Long id;
    private final Deck deck;
    private final Map<Long, Player> players;
    private final List<Long> playerOrder;
    private final Stack<Card> tableCards;
    private GameState state;
    private Long hostId;
    private int turn;

    public final static int DECK_COUNT = 2; // the game is played with two decks

    public Game(Long id, Player host) {
        this.id = id;
        this.deck = new Deck(DECK_COUNT);
        this.players = new HashMap<>();
        this.playerOrder = new ArrayList<>();
        this.tableCards = new Stack<>();
        this.turn = 0;
        this.hostId = host.id;
        this.state = InitState.instance();

        addPlayer(host);
    }

    public Game start() {
        deck.shuffle();
        dealStartingHands();
        dealTableCard();
        state = UncoverTwoState.instance();
        return this;
    }

    public Game dealStartingHands() {
        for (var player : players.values()) {
            var cards = deck.deal(Hand.HAND_SIZE).orElseThrow();
            player.giveCards(cards);
        }

        return this;
    }

    public Game dealTableCard() {
        var card =  deck.deal().orElseThrow();
        tableCards.push(card);
        return this;
    }

    public Game takeFromDeck(Long playerId) {
        var player = getPlayer(playerId).orElseThrow();
        var deckCard = deck.deal().orElseThrow();
        player.setHeldCard(deckCard);
        return this;
    }

    public Game takeFromTable(Long playerId) {
        var player = getPlayer(playerId).orElseThrow();
        player.setHeldCard(tableCards.pop());
        return this;
    }

    public Game discard(Long playerId) {
        var player = getPlayer(playerId).orElseThrow();
        var card = player.heldCard().orElseThrow();
        tableCards.push(card);
        player.setHeldCard(null);
        return this;
    }

    public Game swapCard(Long playerId, int index) {
        var player = getPlayer(playerId).orElseThrow();
        var hand = player.hand();
        var heldCard = player.heldCard().orElseThrow();
        var cardAtIndex = hand.cardAtIndex(index);

        tableCards.push(cardAtIndex);
        hand.setCardAtIndex(index, heldCard);
        hand.uncover(index);
        player.setHeldCard(null);

        return this;
    }

    public Game uncover(Long playerId, int handIndex) {
        var player = getPlayer(playerId).orElseThrow();
        player.hand().uncover(handIndex);
        return this;
    }

    public Game handleEvent(Event event) {
        return state.handleEvent(this, event);
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

    public boolean isPlayersTurn(Long playerId) {
        return playerTurn().equals(playerId);
    }

    public Optional<Player> getPlayer(Long playerId) {
        return Optional.ofNullable(players.get(playerId));
    }

    public Collection<Player> getPlayers() {
        return players.values();
    }

    public Long getHostId() {
        return hostId;
    }

    public Game setHostId(Long hostId) {
        this.hostId = hostId;
        return this;
    }

    @JsonIgnore
    public Deck getDeck() {
        return deck;
    }

    public Optional<Card> getTableCard() {
        try {
            return Optional.of(tableCards.peek());
        } catch (EmptyStackException e) {
            return Optional.empty();
        }
    }

    public Optional<Card> getDeckCard() {
        return Optional.ofNullable(deck.getCards().get(0));
    }

    @JsonProperty
    public boolean hasStarted() {
        return !(state instanceof InitState);
    }

    public GameState state() {
        return state;
    }

    public GameState.StateType getStateType() {
        return state.type();
    }

    public Game setState(GameState state) {
        this.state = state;
        return this;
    }

    public int getTurn() {
        return turn;
    }

    public Game nextTurn() {
        turn++;
        return this;
    }

    @JsonProperty
    public List<CardLocation> playableCards() {
        return state.playableCards(this);
    }

    @Override
    public String toString() {
        return "Game{" +
                "id=" + id +
                ", hostId=" + hostId +
                ", players=" + players +
                ", stateType=" + getStateType() +
                ", deck=" + deck +
                ", tableCards=" + tableCards +
                ", turn=" + turn +
                ", playerOrder=" + playerOrder +
                '}';
    }
}
