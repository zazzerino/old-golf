package com.kdp.golf.websocket.message;

import com.kdp.golf.websocket.message.action.DiscardMessage;
import com.kdp.golf.websocket.message.action.SwapCardMessage;
import com.kdp.golf.websocket.message.action.TakeFromDeckMessage;
import com.kdp.golf.websocket.message.action.TakeFromTableMessage;
import io.vertx.core.json.JsonObject;
import org.jboss.logging.Logger;

import javax.websocket.DecodeException;
import javax.websocket.Decoder;
import javax.websocket.EndpointConfig;

public class MessageDecoder implements Decoder.Text<Message> {
    Logger log = Logger.getLogger("MessageDecoder");

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

            case TAKE_FROM_DECK -> {
                var gameId = jsonObject.getLong("gameId");
                var playerId = jsonObject.getLong("playerId");
                return new TakeFromDeckMessage(gameId, playerId);
            }

            case TAKE_FROM_TABLE -> {
                var gameId = jsonObject.getLong("gameId");
                var playerId = jsonObject.getLong("playerId");
                return new TakeFromTableMessage(gameId, playerId);
            }

            case SWAP_CARD -> {
                var gameId = jsonObject.getLong("gameId");
                var playerId = jsonObject.getLong("playerId");
                var index = jsonObject.getInteger("index");
                return new SwapCardMessage(gameId, playerId, index);
            }

            case DISCARD -> {
                var gameId = jsonObject.getLong("gameId");
                var playerId = jsonObject.getLong("playerId");
                return new DiscardMessage(gameId, playerId);
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
