package com.kdp.golf.user;

import javax.enterprise.context.ApplicationScoped;
import java.util.Collection;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@ApplicationScoped
public class UserDao {

    private final Map<Long, User> users = new ConcurrentHashMap<>();

    public Collection<User> getAll() {
        return users.values();
    }

    public Optional<User> getById(Long id) {
        return Optional.ofNullable(users.get(id));
    }

    public Optional<User> getBySessionId(String sessionId) {
        return users.values()
                .stream()
                .filter(u -> u.sessionId.equals(sessionId))
                .findFirst();
    }

    public void save(User user) {
        users.put(user.id, user);
    }

    public void delete(User user) {
        users.remove(user.id);
    }
}
