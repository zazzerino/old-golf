package com.kdp.golf.game;

import com.kdp.golf.game.logic.Game;

import javax.enterprise.context.ApplicationScoped;
import java.util.Collection;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@ApplicationScoped
public class GameDao {

    private final Map<Long, Game> games = new ConcurrentHashMap<>();

    public Collection<Game> getAll() {
        return games.values();
    }

    public Optional<Game> getById(Long id) {
        return Optional.ofNullable(games.get(id));
    }

    public void save(Game game) {
        games.put(game.id, game);
    }

    public void delete(Game game) {
        games.remove(game.id);
    }
}
