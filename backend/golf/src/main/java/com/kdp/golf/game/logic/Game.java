package com.kdp.golf.game.logic;

import com.fasterxml.jackson.annotation.JsonProperty;
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
        var player = players.get(playerId);
        var deckCard = deck.deal().orElseThrow();

        player.setHeldCard(deckCard);
//        state = State.DISCARD;

        return this;
    }

    public Game takeFromTable(Long playerId) {
        var player = players.get(playerId);
        player.setHeldCard(tableCards.pop());
//        state = State.DISCARD;

        return this;
    }

    public Game discard(Long playerId) {
        var player = players.get(playerId);
        var card = player.heldCard().orElseThrow();
        tableCards.push(card);
        player.setHeldCard(null);

//        state = State.UNCOVER;
        turn++;

        return this;
    }

    public Game swapCard(Long playerId, int index) {
        var player = players.get(playerId);
        var hand = player.hand();
        var heldCard = player.heldCard().orElseThrow();

        var cardAtIndex = hand.cardAtIndex(index);
        tableCards.push(cardAtIndex);

        hand.setCardAtIndex(index, heldCard);
        hand.uncover(index);
        player.setHeldCard(null);

//        state = State.UNCOVER;
        turn++;

        return this;
    }

    public Game uncover(Long playerId, int handIndex) {
        var player = players.get(playerId);
        var hand = player.hand();

//        if (state == State.INIT_UNCOVER) {
//            var uncoveredCount = player.getHand().uncoveredCards().size();
//            if (uncoveredCount < 2) {
//                hand.uncover(handIndex);
//            }
//
//            var allReady = players.values().stream()
//                    .map(Player::getHand)
//                    .allMatch(h -> h.uncoveredCards().size() == 2);
//
//            if (allReady) {
//                state = State.PICKUP;
//            }
//        } else if (state == State.UNCOVER) {
//            var allUncovered = players.values().stream()
//                    .map(Player::getHand)
//                    .allMatch(Hand::allUncovered);
//
//            hand.uncover(handIndex);
//            state = allUncovered ? State.FINAL_PICKUP : State.PICKUP;
//        }

        return this;
    }

    public Game handleEvent(Event event) {
//        if (state == State.PICKUP) {
//            if (event instanceof TakeFromDeckEvent a) {
//                takeFromDeck(a.playerId());
//            } else if (event instanceof TakeFromTableEvent a) {
//                takeFromTable(a.playerId());
//            }
//        } else if (state == State.DISCARD) {
//            if (event instanceof DiscardEvent a) {
//                discard(a.playerId());
//            } else if (event instanceof SwapCardEvent a) {
//                swapCard(a.playerId(), a.handIndex());
//            }
//        } else if (state == State.UNCOVER || state == State.INIT_UNCOVER) {
//            if (event instanceof UncoverEvent u) {
//                uncover(u.playerId(), u.handIndex());
//            }
//        } else {
//            throw new UnsupportedOperationException();
//        }

        return this;
    }

    public Long nextPlayerTurn() {
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

    @JsonProperty
    public Collection<Player> players() {
        return players.values();
    }

    @JsonProperty
    public Long HostId() {
        return hostId;
    }

    public void setHostId(Long hostId) {
        this.hostId = hostId;
    }

    @JsonProperty
    public Deck deck() {
        return deck;
    }

    @JsonProperty
    public Optional<Card> tableCard() {
        try {
            return Optional.of(tableCards.peek());
        } catch (EmptyStackException e) {
            return Optional.empty();
        }
    }

    @JsonProperty
    public Map<Long, Integer> scores() {
        Map<Long, Integer> scores = new HashMap<>();

        if (hasStarted()) {
            for (var player : players.values()) {
                scores.put(player.id, player.score());
            }
        }

        return scores;
    }

    @JsonProperty
    public Optional<Card> deckCard() {
        return Optional.ofNullable(deck.getCards().get(0));
    }

    @JsonProperty
    public boolean hasStarted() {
//        return state != State.INIT;
        return !(state instanceof InitState);
    }

    @JsonProperty
    public GameState state() {
        return state;
    }

    @JsonProperty
    public int turn() {
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
