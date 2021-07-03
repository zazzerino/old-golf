package com.kdp.golf.websocket.message;

import io.vertx.core.json.JsonObject;

import javax.websocket.DecodeException;
import javax.websocket.Decoder;
import javax.websocket.EndpointConfig;

public class MessageDecoder implements Decoder.Text<Message> {

    @Override
    public Message decode(String s) throws DecodeException {
        var jsonObject = new JsonObject(s);
        var messageType = typeOf(jsonObject);

        switch (messageType) {
            case LOGIN -> {
                var name = jsonObject.getString("name");
                return new LoginMessage(name);
            }

            case CREATE_GAME -> {
                return new CreateGameMessage();
            }

            case START_GAME -> {
                var gameId = jsonObject.getLong("gameId");
                return new StartGameMessage(gameId);
            }

            default -> throw new DecodeException(s, "unrecognized message type: " + messageType);
        }
    }

    @Override
    public boolean willDecode(String s) {
        var jsonObject = new JsonObject(s);
        return typeOf(jsonObject) != null;
    }

    @Override
    public void init(EndpointConfig config) {
    }

    @Override
    public void destroy() {
    }

    private Message.Type typeOf(JsonObject json) {
        var type = json.getString("type");
        return Message.Type.valueOf(type);
    }
}
