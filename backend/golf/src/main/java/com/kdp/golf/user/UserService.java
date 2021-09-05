package com.kdp.golf.user;

import com.kdp.golf.IdService;

import javax.enterprise.context.ApplicationScoped;
import java.util.Optional;

@ApplicationScoped
public class UserService {

    private final IdService idService;
    private final UserDao userDao;

    public UserService(IdService idService, UserDao userDao) {
        this.idService = idService;
        this.userDao = userDao;
    }

    public User createAnonymous(String sessionId) {
        var user = new User(idService.nextUserId(), sessionId);
        userDao.save(user);
        return user;
    }

    public Optional<User> getById(Long id) {
        return userDao.getById(id);
    }

    public Optional<User> getBySessionId(String sessionId) {
        return userDao.getBySessionId(sessionId);
    }

    public User login(Long userId, String name) {
        var user = getById(userId).orElseThrow();
        user.setName(name);
        userDao.save(user);
        return user;
    }

    public User save(User user) {
        userDao.save(user);
        return user;
    }

    public User delete(String sessionId) {
        var user = userDao
                .getBySessionId(sessionId)
                .orElseThrow();

        userDao.delete(user);
        return user;
    }
}
