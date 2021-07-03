package com.kdp.golf.websocket.response;

import com.kdp.golf.user.User;

public record LoginResponse(User user) implements Response {

    public Type type() {
        return Type.LOGIN;
    }
}
