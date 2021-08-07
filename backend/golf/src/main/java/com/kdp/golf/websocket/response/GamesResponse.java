package com.kdp.golf.websocket.response;

import com.kdp.golf.game.logic.Game;

import java.util.Collection;

public record GamesResponse(Collection<Game> games) implements Response {

    public Type type() {
        return Type.GAMES;
    }
}
