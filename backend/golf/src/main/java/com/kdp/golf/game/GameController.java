package com.kdp.golf.game;

import com.kdp.golf.game.logic.Game;
import com.kdp.golf.game.logic.event.Event;
import com.kdp.golf.user.UserService;
import com.kdp.golf.websocket.WebSocket;
import com.kdp.golf.websocket.response.GameResponse;
import com.kdp.golf.websocket.response.GamesResponse;
import org.jboss.logging.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.websocket.Session;

@ApplicationScoped
public class GameController {

    private final WebSocket webSocket;
    private final GameService gameService;
    private final UserService userService;
    private final Logger log = Logger.getLogger(GameController.class);

    public GameController(WebSocket webSocket, GameService gameService, UserService userService) {
        this.webSocket = webSocket;
        this.gameService = gameService;
        this.userService = userService;
    }

    public void getAll(Session session) {
        var games = gameService.getAll();
        webSocket.sendToSession(session, new GamesResponse(games));
    }

    public void joinGame(Session session, Long gameId, Long userId) {
        var game = gameService.joinGame(gameId, userId);
        game.ifPresent(this::notifyPlayers);
    }

    public void createGame(Session session, Long userId) {
        var game = gameService.createGame(userId);
        log.info("game created: " + game);
        webSocket.sendToSession(session, new GameResponse(game));
        broadcastGames();
    }

    public void startGame(Session session, Long gameId) {
        var game = gameService.startGame(gameId);
        log.info("game started: " + game);
        notifyPlayers(game);
    }

    public void handleEvent(Session session, Event event) {
        log.info("handling event: " + event);
        var game = gameService.handleEvent(event);
        log.info("event handled: " + game);
        webSocket.sendToSession(session, new GameResponse(game));
    }

    public void notifyPlayers(Game game) {
        for (var player : game.getPlayers()) {
            var user = userService.getById(player.id).orElseThrow();
            webSocket.sendToSessionId(user.sessionId, new GameResponse(game));
        }
    }

    public void broadcastGames() {
        var games = gameService.getAll();
        webSocket.broadcast(new GamesResponse(games));
    }
}
