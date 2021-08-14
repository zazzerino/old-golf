package com.kdp.golf;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
class UtilTest {

    @Test
    void sum() {
        var n = Util.sum(List.of(1, 2, 3, 4));
        assertEquals(10, n);
    }

    @Test
    void pickItems() {
        var items = List.of(1, 2, 3, 4);
        assertEquals(List.of(1, 3), Util.pickItems(items, List.of(0, 2)));
    }

    @Test
    void allEqual() {
        var l0 = List.of(1, 2, 3, 4);
        assertFalse(Util.allEqual(l0));

        var l1 = List.of(4, 4, 4, 4);
        assertTrue(Util.allEqual(l1));
    }
}