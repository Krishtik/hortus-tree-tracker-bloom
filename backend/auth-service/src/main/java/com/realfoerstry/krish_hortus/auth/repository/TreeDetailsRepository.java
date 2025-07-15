package com.realfoerstry.krish_hortus.auth.repository;

import com.realfoerstry.krish_hortus.auth.entity.TreeDetails;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TreeDetailsRepository extends JpaRepository<TreeDetails, UUID> {
}
