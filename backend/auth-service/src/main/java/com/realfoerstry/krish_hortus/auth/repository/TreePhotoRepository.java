package com.realfoerstry.krish_hortus.auth.repository;

import com.realfoerstry.krish_hortus.auth.entity.TreePhoto;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TreePhotoRepository extends JpaRepository<TreePhoto, UUID> {
    List<TreePhoto> findByTreeTreeId(UUID treeId);
}
