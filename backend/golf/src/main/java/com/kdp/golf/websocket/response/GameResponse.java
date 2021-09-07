package com.kdp.golf.websocket.response;

import com.kdp.golf.game.logic.GameView;

public record GameResponse(GameView game) implements Response {

    public Type type() {
        return Type.GAME;
    }
}
