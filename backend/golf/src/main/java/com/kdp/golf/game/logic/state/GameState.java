package com.kdp.golf.game.logic.state;

public interface GameState {
    GameState handleEvent();
    GameState next();
}
