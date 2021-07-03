package com.kdp.golf.websocket.response;

import com.kdp.golf.game.logic.Game;

public record GameResponse(Game game) implements Response {

    public Type type() {
        return Type.GAME;
    }
}
