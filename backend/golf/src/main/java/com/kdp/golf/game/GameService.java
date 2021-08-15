package com.kdp.golf.game;

import com.kdp.golf.IdService;
import com.kdp.golf.game.logic.Game;
import com.kdp.golf.game.logic.Player;
import com.kdp.golf.game.logic.event.Event;
import com.kdp.golf.user.UserService;

import javax.enterprise.context.ApplicationScoped;
import java.util.Collection;

@ApplicationScoped
public class GameService {

    private final IdService idService;
    private final GameDao gameDao;
    private final UserService userService;

    public GameService(IdService idService, GameDao gameDao, UserService userService) {
        this.idService = idService;
        this.gameDao = gameDao;
        this.userService = userService;
    }

    public Game createGame(String sessionId) {
        var user = userService
                .getBySessionId(sessionId)
                .orElseThrow();

        var gameId = idService.nextGameId();
        var player = Player.from(user);
        var game = new Game(gameId, player);

        gameDao.save(game);

        user.setGameId(gameId);
        userService.update(user);

        return game;
    }

    public Game startGame(Long gameId) {
        var game = gameDao
                .getById(gameId)
                .orElseThrow();

        if (game.hasStarted()) {
            throw new IllegalStateException("game has already started");
        }

        game.start();
        gameDao.save(game);

        return game;
    }

    public Collection<Game> getAll() {
        return gameDao.getAll();
    }

    public Game takeFromDeck(Long gameId, Long playerId) {
        var game = gameDao
                .getById(gameId)
                .orElseThrow();

        game.takeFromDeck(playerId);
        gameDao.save(game);

        return game;
    }

    public Game handleAction(Event event) {
        var game = gameDao
                .getById(event.gameId())
                .orElseThrow();

        game.handleEvent(event);
        gameDao.save(game);

        return game;
    }
}
