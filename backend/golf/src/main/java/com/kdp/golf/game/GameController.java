package com.kdp.golf.game;

import com.kdp.golf.game.logic.actions.Action;
import com.kdp.golf.websocket.WebSocket;
import com.kdp.golf.websocket.response.GameResponse;
import com.kdp.golf.websocket.response.GamesResponse;
import org.jboss.logging.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.websocket.Session;

@ApplicationScoped
public class GameController {

    private final GameService gameService;
    private final WebSocket webSocket;
    private final Logger log = Logger.getLogger(GameController.class);

    public GameController(GameService gameService, WebSocket webSocket) {
        this.gameService = gameService;
        this.webSocket = webSocket;
    }

    public void getAll(Session session) {
        var games = gameService.getAll();
        var response = new GamesResponse(games);
        webSocket.sendToSession(session, response);
    }

    public void createGame(Session session) {
        var game = gameService.createGame(session.getId());
        log.info("game created: " + game);

        var response = new GameResponse(game);
        webSocket.sendToSession(session, response);
    }

    public void startGame(Session session, Long gameId) {
        var game = gameService.startGame(gameId);
        log.info("game started: " + game);

        var response = new GameResponse(game);
        webSocket.sendToSession(session, response);
    }

    public void handleAction(Session session, Action action) {
        var game = gameService.handleAction(action);
        log.info("game action handled: " + game);

        var response = new GameResponse(game);
        webSocket.sendToSession(session, response);
    }
}
