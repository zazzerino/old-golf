package com.kdp.golf.game;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.immutables.value.Value;

import java.util.List;

@Value.Immutable
@JsonSerialize(as = ImmutableGame.class)
public abstract class Game {

    public abstract Long id();
    public abstract List<Player> players();
    public abstract Deck deck();

    public static Game create(Long id) {
        return ImmutableGame.builder()
                .id(id)
                .players(List.of())
                .deck(Deck.create().shuffle())
                .build();
    }

    public static Game create(Long id, List<Player> players) {
        return ImmutableGame.builder()
                .id(id)
                .players(players)
                .deck(Deck.create().shuffle())
                .build();
    }

    public Game addPlayer(Player player) {
        return ImmutableGame.builder()
                .from(this)
                .addPlayers(player)
                .build();
    }

    public Game dealInitialCards() {
//        var players = players().stream()
//                .map(player -> {
//                    var dealResult = deck().deal()
//                })
//                .toList();

        return ImmutableGame.builder()
                .from(this)
                .build();
    }

    public Game dealCardTo(Player player) {
        return ImmutableGame.builder()
                .from(this)
                .build();
    }
}
