package com.kdp.golf.game;

public record Error(String message) {

    enum ErrorType {
        NOT_HOST,
        ALREADY_STARTED,
    }
}
