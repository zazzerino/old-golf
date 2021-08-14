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
    private final Stack<Card> tableCards = new Stack<>();

    private int turn;
    private Long hostId;
    private State state;

    public final static int DECK_COUNT = 2; // the game is played with two decks

    enum State {
        INIT,
        INIT_UNCOVER,
        PICKUP,
        DISCARD,
        UNCOVER,
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

        state = State.INIT_UNCOVER;
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

    public Hand getPlayerHand(Long playerId) {
        return players.get(playerId).getHand();
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
        player.setHeldCard(tableCards.pop());
        state = State.DISCARD;

        return this;
    }

    public Game discard(Long playerId) {
        var player = players.get(playerId);
        var card = player.getHeldCard().orElseThrow();
        tableCards.push(card);
        player.setHeldCard(null);

        state = State.UNCOVER;
        turn++;

        return this;
    }

    public Game swapCard(Long playerId, int index) {
        var player = players.get(playerId);
        var hand = player.getHand();
        var heldCard = player.getHeldCard().orElseThrow();

        var cardAtIndex = hand.atIndex(index);
        tableCards.push(cardAtIndex);

        hand.setAtIndex(index, heldCard);
        hand.uncover(index);
        player.setHeldCard(null);

        state = State.UNCOVER;
        turn++;

        return this;
    }

    public Game uncover(Long playerId, int handIndex) {
        var player = players.get(playerId);
        var hand = player.getHand();

        if (state == State.INIT_UNCOVER) {
            var uncoveredCount = player.getHand().uncoveredCards().size();
            if (uncoveredCount < 2) {
                hand.uncover(handIndex);
            }

            var allReady = players.values().stream().allMatch(p -> p.getHand().uncoveredCards().size() == 2);
            if (allReady) {
                state = State.PICKUP;
            }
        } else if (state == State.UNCOVER) {
            var allUncovered = players.values()
                    .stream()
                    .allMatch(p -> p.getHand().allUncovered());

            hand.uncover(handIndex);
            state = allUncovered ? State.FINAL_PICKUP : State.PICKUP;
        }

        return this;
    }

    public Game handleAction(Action action) {
        if (state == State.PICKUP) {
            if (action instanceof TakeFromDeckAction a) {
                takeFromDeck(a.playerId());
            } else if (action instanceof TakeFromTableAction a) {
                takeFromTable(a.playerId());
            }
        } else if (state == State.DISCARD) {
            if (action instanceof DiscardAction a) {
                discard(a.playerId());
            } else if (action instanceof SwapCardAction a) {
                swapCard(a.playerId(), a.handIndex());
            }
        } else if (state == State.UNCOVER || state == State.INIT_UNCOVER) {
            if (action instanceof UncoverAction u) {
                uncover(u.playerId(), u.handIndex());
            }
        } else {
            throw new UnsupportedOperationException();
        }

        return this;
    }

    public Long getPlayerTurn() {
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
        try {
            return Optional.of(tableCards.peek());
        } catch (EmptyStackException e) {
            return Optional.empty();
        }
    }

    public Map<Long, Integer> getScores() {
        Map<Long, Integer> scores = new HashMap<>();

        if (hasStarted()) {
            for (var player : players.values()) {
                scores.put(player.id, player.getScore());
            }
        }

        return scores;
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
                ", tableCards=" + tableCards +
                ", turn=" + turn +
                ", playerOrder=" + playerOrder +
                '}';
    }
}
