package com.kdp.golf.game.logic;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import java.util.Arrays;
import java.util.Optional;

@JsonSerialize(using = CardSerializer.class)
public record Card(Rank rank,
                   Suit suit) {

    public int golfValue() {
        return rank.golfValue();
    }

    public String name() {
        return rank.value + suit.value;
    }

    public static Card from(String s) {
        assert(s.length() == 2);

        var chars = s.split("(?!^)");
        assert(chars.length == 2);

        var rank = Rank.from(chars[0]).orElseThrow();
        var suit = Suit.from(chars[1]).orElseThrow();

        return new Card(rank, suit);
    }

    @Override
    public String toString() {
        return name();
    }

    public enum Rank {
        ACE("A"),
        TWO("2"),
        THREE("3"),
        FOUR("4"),
        FIVE("5"),
        SIX("6"),
        SEVEN("7"),
        EIGHT("8"),
        NINE("9"),
        TEN("T"),
        JACK("J"),
        QUEEN("Q"),
        KING("K");

        public final String value;

        Rank(String value) {
            this.value = value;
        }
        public int golfValue() {
            return switch (this) {
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

        public static Optional<Rank> from(String s) {
            return Arrays.stream(values())
                    .filter(rank -> rank.value.equals(s))
                    .findAny();
        }
    }

    public enum Suit {
        CLUBS("C"),
        DIAMONDS("D"),
        HEARTS("H"),
        SPADES("S");

        public final String value;

        Suit(String value) {
            this.value = value;
        }

        public static Optional<Suit> from(String s) {
            return Arrays.stream(values())
                    .filter(suit -> suit.value.equals(s))
                    .findAny();
        }
    }
}
