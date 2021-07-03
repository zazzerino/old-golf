package com.kdp.golf.game.logic;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;

@JsonSerialize(using = CardSerializer.class)
public record Card(Rank rank,
                   Suit suit) {

    public int golfValue() {
        return switch (rank) {
            case KING -> 0;
            case ACE -> 1;
            case TWO -> 2;
            case THREE -> 3;
            case FOUR -> 4;
            case FIVE -> 5;
            case SIX -> 6;
            case SEVEN -> 7;
            case EIGHT -> 8;
            case NINE -> 9;
            case TEN, JACK, QUEEN -> 10;
        };
    }

    public String name() {
        return rank.value + suit.value;
    }

    enum Rank {
        ACE("A"),
        TWO("2"),
        THREE("3"),
        FOUR("4"),
        FIVE("5"),
        SIX("6"),
        SEVEN("7"),
        EIGHT("8"),
        NINE("9"),
        TEN("10"),
        JACK("J"),
        QUEEN("Q"),
        KING("K");

        private String value;

        Rank(String value) {
            this.value = value;
        }
    }

    enum Suit {
        CLUBS("C"),
        DIAMONDS("D"),
        HEARTS("H"),
        SPADES("S");

        private String value;

        Suit(String value) {
            this.value = value;
        }
    }
}
