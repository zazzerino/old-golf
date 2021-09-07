package com.kdp.golf.game.logic;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.kdp.golf.game.logic.card.Card;
import com.kdp.golf.game.logic.event.*;
import com.kdp.golf.game.logic.state.*;

import java.util.*;
import java.util.stream.Collectors;

public class Game {

    public final Long id;
    private final Deck deck;
    private final Map<Long, Player> players;
    private final List<Long> playerOrder;
    private final Deque<Card> tableCards;
    private State state;
    private Long hostId;
    private int turn;
    private final List<Event> events;

    public final static int DECK_COUNT = 2; // the game is played with two decks

    public Game(Long id, Player host) {
        this.id = id;
        this.deck = new Deck(DECK_COUNT);
        this.players = new HashMap<>();
        this.playerOrder = new ArrayList<>();
        this.tableCards = new ArrayDeque<>();
        this.turn = 0;
        this.hostId = host.id;
        this.state = InitState.instance;
        this.events = new ArrayList<>();

        addPlayer(host);
    }

    public Game start() {
        deck.shuffle();
        dealStartingHands();
        dealTableCard();
        state = UncoverTwoState.instance;
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
        tableCards.addFirst(card);
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
        player.setHeldCard(tableCards.removeFirst());
        return this;
    }

    public Game discard(Long playerId) {
        var player = getPlayer(playerId).orElseThrow();
        var card = player.getHeldCard().orElseThrow();
        tableCards.addFirst(card);
        player.setHeldCard(null);
        return this;
    }

    public Game swapCard(Long playerId, int index) {
        var player = getPlayer(playerId).orElseThrow();
        var hand = player.getHand();
        var heldCard = player.getHeldCard().orElseThrow();
        var cardAtIndex = hand.cardAtIndex(index);

        tableCards.addFirst(cardAtIndex);
        hand.setCardAtIndex(index, heldCard);
        hand.uncover(index);
        player.setHeldCard(null);

        return this;
    }

    public Game uncover(Long playerId, int handIndex) {
        var player = getPlayer(playerId).orElseThrow();
        player.getHand().uncover(handIndex);
        return this;
    }

    public Game handleEvent(Event event) {
        events.add(event);
        return state.handleEvent(this, event);
    }

    @JsonIgnore
    public List<Long> getPlayerOrder() {
        return playerOrder;
    }

    public List<Long> playerOrderFrom(Long playerId) {
        var index = playerOrder.indexOf(playerId);
        List<Long> copy = new ArrayList<>(playerOrder);
        Collections.rotate(copy, -index);
        return copy;
    }

    @JsonProperty
    public Long playerTurn() {
        var index = turn % players.size();
        return playerOrder.get(index);
    }

    public Game addPlayer(Player player) {
        if (players.values().size() > 4) {
            throw new IllegalStateException("can only have a maximum of four players");
        }

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
            return Optional.of(tableCards.getFirst());
        } catch (NoSuchElementException e) {
            return Optional.empty();
        }
    }

    public Deque<Card> getTableCards() {
        return tableCards;
    }

    public Optional<Card> getDeckCard() {
        return Optional.ofNullable(deck.getCards().get(0));
    }

    @JsonProperty
    public boolean hasStarted() {
        return !(state instanceof InitState);
    }

    public State state() {
        return state;
    }

    public State.Type getStateType() {
        return state.type();
    }

    public Game setState(State state) {
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

    public List<Card.Location> playableCards(Long playerId) {
        if (isPlayersTurn(playerId) || state instanceof UncoverTwoState) {
            return state.playableCards(this);
        }
        return List.of();
    }

    public Map<Long, List<Card.Location>> getPlayableCards() {
        return players.values().stream()
                .collect(Collectors.toMap(p -> p.id, p -> playableCards(p.id)));
    }

    public Map<Long, List<Long>> getPlayerOrders() {
        return players.keySet().stream()
                .collect(Collectors.toMap(
                        id -> id,
                        this::playerOrderFrom));
    }

    public List<Event> getEvents() {
        return events;
    }

    public Game setPlayerName(Long playerId, String name) {
        var player = players.values().stream()
                .filter(p -> Objects.equals(p.id, playerId))
                .findFirst()
                .orElseThrow();

        player.setName(name);
        return this;
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
