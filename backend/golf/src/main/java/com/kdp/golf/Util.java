package com.kdp.golf;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

public class Util {

    public static <N extends Number> int sumInt(List<N> ns) {
        return ns.stream()
                .mapToInt(Number::intValue)
                .sum();
    }

    public static <T> List<T> pickItems(List<T> items, List<Integer> itemsToPick) {
        List<T> result = new ArrayList<>();

        for (var i : itemsToPick) {
            result.add(items.get(i));
        }

        return result;
    }

    public static <T> boolean allEqual(List<T> items) {
        return items.stream().distinct().count() == 1;
    }

    public static <T> boolean indicesEqual(List<T> items, List<Integer> indices) {
        var picked = pickItems(items, indices);
        return allEqual(picked);
    }

    public static <T, U> Map<T,U> removeKeys(Map<T, U> map, Collection<T> keys) {
        for (var k : keys) {
            map.remove(k);
        }

        return map;
    }
}
