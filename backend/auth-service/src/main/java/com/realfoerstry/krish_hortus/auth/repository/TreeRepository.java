package com.realfoerstry.krish_hortus.auth.repository;


import com.realfoerstry.krish_hortus.auth.entity.Tree;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TreeRepository extends JpaRepository<Tree, UUID> {
    // You can add custom queries here later if needed
}