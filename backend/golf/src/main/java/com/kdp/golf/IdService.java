package com.kdp.golf;

import javax.enterprise.context.ApplicationScoped;
import java.util.concurrent.atomic.AtomicLong;

@ApplicationScoped
public class IdService {

    private final AtomicLong nextUserId = new AtomicLong(0);
    private final AtomicLong nextGameId = new AtomicLong(0);

    public Long nextUserId() {
        return nextUserId.getAndIncrement();
    }

    public Long nextGameId() {
        return nextGameId.getAndIncrement();
    }
}
