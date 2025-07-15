package com.realfoerstry.krish_hortus.auth.controller;

import com.realfoerstry.krish_hortus.auth.dto.TreeDetailsDto;
import com.realfoerstry.krish_hortus.auth.service.TreeService;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/trees")
public class TreeController {

    private final TreeService treeService;

    public TreeController(TreeService treeService) {
        this.treeService = treeService;
    }

    @GetMapping("/{treeId}")
    public TreeDetailsDto getTreeDetails(@PathVariable UUID treeId) {
        return treeService.getTreeDetails(treeId);
    }
}
