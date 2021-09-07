package com.kdp.golf.websocket.message;

import com.kdp.golf.chat.ChatMessage;
import com.kdp.golf.game.logic.event.Event;
import io.vertx.core.json.JsonObject;

import javax.websocket.DecodeException;
import javax.websocket.Decoder;
import javax.websocket.EndpointConfig;
import java.util.Optional;

public class MessageDecoder implements Decoder.Text<Message> {

    @Override
    public Message decode(String s) throws DecodeException {
        var jsonObject = new JsonObject(s);
        var messageType = typeOf(jsonObject);

        switch (messageType) {
            case LOGIN -> {
                var userId = jsonObject.getLong("userId");
                var name = jsonObject.getString("name");
                return new LoginMessage(userId, name);
            }

            case JOIN_GAME -> {
                var gameId = jsonObject.getLong("gameId");
                var userId = jsonObject.getLong("userId");
                return new JoinGameMessage(gameId, userId);
            }

            case CREATE_GAME -> {
                var userId = jsonObject.getLong("userId");
                return new CreateGameMessage(userId);
            }

            case START_GAME -> {
                var gameId = jsonObject.getLong("gameId");
                var userId = jsonObject.getLong("userId");
                return new StartGameMessage(gameId, userId);
            }

            case EVENT -> {
                var gameId = jsonObject.getLong("gameId");
                var playerId = jsonObject.getLong("playerId");
                var eventType = Event.EventType.valueOf(jsonObject.getString("eventType"));
                var handIndex = Optional.ofNullable(jsonObject.getInteger("handIndex"));
                return new EventMessage(gameId, playerId, eventType, handIndex);
            }

            case CHAT -> {
                var gameId = jsonObject.getLong("gameId");
                var userId = jsonObject.getLong("userId");
                var userName = jsonObject.getString("userName");
                var text = jsonObject.getString("text");
                var chatMessage = new ChatMessage(gameId, userId, userName, text);
                return new ChatMessageMessage(chatMessage);
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
