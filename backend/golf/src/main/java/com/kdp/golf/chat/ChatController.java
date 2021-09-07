package com.kdp.golf.chat;

import com.kdp.golf.game.GameController;
import com.kdp.golf.game.GameService;
import com.kdp.golf.websocket.response.ChatResponse;

import javax.enterprise.context.ApplicationScoped;
import javax.websocket.Session;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

@ApplicationScoped
public class ChatController {

    private final ConcurrentHashMap<Long, List<ChatMessage>> messages = new ConcurrentHashMap<>();
    private final GameService gameService;
    private final GameController gameController;

    public ChatController(GameService gameService, GameController gameController) {
        this.gameService = gameService;
        this.gameController = gameController;
    }

    public void handleChatMessage(Session session, ChatMessage message) {
        var gameId = message.gameId();
        var game = gameService.getById(gameId).orElseThrow();
        var gameMessages = messages.computeIfAbsent(gameId, k -> new ArrayList<>());
        gameMessages.add(message);
        messages.put(gameId, gameMessages);

        var response = new ChatResponse(message);
        gameController.notifyPlayers(game, response);
    }
}
