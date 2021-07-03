package com.kdp.golf.websocket.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public interface Response {

    @JsonProperty
    Type type();

    enum Type {
        LOGIN,
        GAME
    }
}
