package com.kdp.golf;

import javax.enterprise.context.ApplicationScoped;
import java.util.concurrent.atomic.AtomicLong;

@ApplicationScoped
public class IdService {
    private final AtomicLong nextPlayerId = new AtomicLong(0);
    private final AtomicLong nextGameId = new AtomicLong(0);

    public Long generatePlayerId() {
        return nextPlayerId.getAndIncrement();
    }

    public Long generateGameId() {
        return nextGameId.getAndIncrement();
    }
}
