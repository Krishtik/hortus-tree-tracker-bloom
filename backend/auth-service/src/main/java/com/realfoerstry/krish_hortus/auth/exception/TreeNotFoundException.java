package com.realfoerstry.krish_hortus.auth.exception;
import java.util.UUID;

public class TreeNotFoundException extends RuntimeException {
    public TreeNotFoundException(UUID treeId) {
        super("Tree not found with ID: " + treeId);
    }
}
