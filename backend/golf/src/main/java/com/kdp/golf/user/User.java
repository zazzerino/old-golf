package com.kdp.golf.user;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.Objects;

public class User {

    public final Long id;
    public final @JsonIgnore String sessionId;
    private String name;
    private Long gameId;

    public final static String DEFAULT_NAME = "anon";

    public User(Long id, String sessionId) {
        this.id = id;
        this.sessionId = sessionId;

        name = DEFAULT_NAME;
    }

    public User(Long id, String sessionId, String name, Long gameId) {
        this.id = id;
        this.sessionId = sessionId;
        this.name = name;
        this.gameId = gameId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @JsonIgnore
    public Long getGameId() {
        return gameId;
    }

    public void setGameId(Long gameId) {
        this.gameId = gameId;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", sessionId=" + sessionId +
                ", name='" + name + '\'' +
                ", gameId=" + gameId +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return id.equals(user.id) && sessionId.equals(user.sessionId) && gameId.equals(user.gameId) && name.equals(user.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, sessionId, gameId, name);
    }
}
