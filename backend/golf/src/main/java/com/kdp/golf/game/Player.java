package com.kdp.golf.game;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.immutables.value.Value;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Value.Immutable
@JsonSerialize(as = ImmutablePlayer.class)
public abstract class Player {
    public abstract Long id();
    public abstract String name();
    public abstract List<Card> cards();

    public Player giveCard(Card card) {
        return ImmutablePlayer.builder()
                .from(this)
                .addCards(card)
                .build();
    }

    public Player giveCards(List<Card> cards) {
        return ImmutablePlayer.builder()
                .from(this)
                .addAllCards(cards)
                .build();
    }

    record TakeCardResult(Card card, Player player) {}

    public TakeCardResult takeCard(Card card) {
        List<Card> copy = new ArrayList<>(cards().size());
        Collections.copy(copy, cards());
        copy.remove(card);

        var player = ImmutablePlayer.builder()
                .from(this)
                .cards(copy)
                .build();

        return new TakeCardResult(card, player);
    }
}
