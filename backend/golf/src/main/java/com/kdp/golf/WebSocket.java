package com.kdp.golf;

import org.jboss.logging.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@ApplicationScoped
@ServerEndpoint(
        value = "/ws"
)
public class WebSocket {
    private final Map<String, Session> sessions = new ConcurrentHashMap<>();
    private final Logger log = Logger.getLogger(WebSocket.class);

    @OnOpen
    public void onOpen(Session session) {
        log.info("websocket connected: " + session.getId());
        sessions.put(session.getId(), session);
    }

    @OnClose
    public void onClose(Session session) {
        log.info("websocket closed: " + session.getId());
        sessions.remove(session.getId());
    }

    @OnError
    public void onError(Session session, Throwable throwable) {
        log.error("websocket error", throwable);
    }

//    public void sendToSession(Session session, Response response)
//    {
//        session.getAsyncRemote()
//                .sendObject(response, result -> {
//                    if (result.getException() != null) {
//                        log.error("error sending to " + session.getId() + ": " + result.getException());
//                    }
//                });
//    }
//
//    public void sendToSessionIds(Collection<String> sessionIds, Response response)
//    {
//        sessionIds.forEach(id -> sendToSession(sessions.get(id), response));
//    }
//
//    public void broadcast(Response response)
//    {
//        sessions.values()
//                .forEach(s -> sendToSession(s, response));
//    }
}
