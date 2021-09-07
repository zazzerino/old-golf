package com.kdp.golf.game;

import com.kdp.golf.IdService;
import com.kdp.golf.game.logic.Game;
import com.kdp.golf.game.logic.Player;
import com.kdp.golf.game.logic.event.Event;
import com.kdp.golf.game.logic.state.State;
import com.kdp.golf.user.UserService;

import javax.enterprise.context.ApplicationScoped;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

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

    public Game createGame(Long userId) {
        var user = userService.getById(userId).orElseThrow();
        var gameId = idService.nextGameId();

        var player = Player.from(user);
        var game = new Game(gameId, player);

        gameDao.save(game);

        user.setGameId(gameId);
        userService.save(user);

        return game;
    }

    public Game startGame(Long gameId, Long playerId) {
        var game = gameDao.getById(gameId).orElseThrow();

        if (game.hasStarted()) {
            throw new IllegalStateException("game has already started");
        }

        game.start();
        gameDao.save(game);
        return game;
    }

    public Optional<Game> getById(Long id) {
        return gameDao.getById(id);
    }

    public Collection<Game> getAll() {
        return gameDao.getAll();
    }

    public Game handleEvent(Event event) {
        var game = gameDao.getById(event.gameId()).orElseThrow();
        game.handleEvent(event);
        gameDao.save(game);
        return game;
    }

    public Game setPlayerName(Long gameId, Long playerId, String name) {
        var game = gameDao.getById(gameId).orElseThrow();
        game.setPlayerName(playerId, name);
        gameDao.save(game);
        return game;
    }

    public Optional<Game> joinGame(Long gameId, Long userId) {
        var game = gameDao.getById(gameId).orElseThrow();

        if (game.getStateType() != State.Type.INIT
                && game.getPlayer(userId).isEmpty()) {
            return Optional.empty();
        }

        var user = userService.getById(userId).orElseThrow();
        var player = Player.from(user);
        game.addPlayer(player);

        gameDao.save(game);

        user.setGameId(game.id);
        userService.save(user);

        return Optional.of(game);
    }
}
