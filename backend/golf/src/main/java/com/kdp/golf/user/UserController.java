package com.kdp.golf.user;

import com.kdp.golf.game.GameController;
import com.kdp.golf.websocket.WebSocket;
import com.kdp.golf.websocket.response.LoginResponse;
import org.jboss.logging.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.websocket.Session;

@ApplicationScoped
public class UserController {

    private final WebSocket webSocket;
    private final UserService userService;
    private final GameController gameController;
    private final Logger log = Logger.getLogger(UserController.class);

    public UserController(WebSocket webSocket, UserService userService, GameController gameController) {
        this.webSocket = webSocket;
        this.userService = userService;
        this.gameController = gameController;
    }

    public void loginAnonymous(Session session) {
        var user = userService.createAnonymous(session.getId());
        log.info("user created: " + user);
        webSocket.sendToSession(session, new LoginResponse(user));
    }

    public void login(Session session, Long userId, String name) {
        var user = userService.login(userId, name);
        log.info("user updated: " + user);
        webSocket.sendToSession(session, new LoginResponse(user));
        user.getGameId().ifPresent(gameId -> {
            gameController.setPlayerName(gameId, userId, name);
        });
    }

    public void sessionClosed(Session session) {
        var user = userService.delete(session.getId());
        log.info("user deleted: " + user);
    }
}
