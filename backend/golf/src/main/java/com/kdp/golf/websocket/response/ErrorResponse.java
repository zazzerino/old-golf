package com.kdp.golf.websocket.response;

public record ErrorResponse(String message) implements Response {

    @Override
    public Type type() {
        return Type.ERROR;
    }
}
