package com.kdp.golf;

import java.util.ArrayList;
import java.util.List;

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
}
