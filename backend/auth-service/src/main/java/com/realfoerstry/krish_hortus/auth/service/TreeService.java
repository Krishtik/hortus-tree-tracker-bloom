package com.realfoerstry.krish_hortus.auth.service;

import com.realfoerstry.krish_hortus.auth.dto.PhotoDto;
import com.realfoerstry.krish_hortus.auth.dto.TreeDetailsDto;
import com.realfoerstry.krish_hortus.auth.entity.TreeDetails;
import com.realfoerstry.krish_hortus.auth.entity.TreePhoto;
import com.realfoerstry.krish_hortus.auth.exception.TreeNotFoundException;
import com.realfoerstry.krish_hortus.auth.mapper.PhotoDtoMapper;
import com.realfoerstry.krish_hortus.auth.mapper.TreeDetailsMapper;
import com.realfoerstry.krish_hortus.auth.repository.TreeDetailsRepository;
import com.realfoerstry.krish_hortus.auth.repository.TreePhotoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TreeService {

    private final TreeDetailsRepository treeDetailsRepository;
    private final TreePhotoRepository treePhotoRepository;
    private final TreeDetailsMapper treeDetailsMapper;
    private final PhotoDtoMapper photoDtoMapper;

    @Autowired
    public TreeService(
            TreeDetailsRepository treeDetailsRepository,
            TreePhotoRepository treePhotoRepository,
            TreeDetailsMapper treeDetailsMapper,
            PhotoDtoMapper photoDtoMapper) {
        this.treeDetailsRepository = treeDetailsRepository;
        this.treePhotoRepository = treePhotoRepository;
        this.treeDetailsMapper = treeDetailsMapper;
        this.photoDtoMapper = photoDtoMapper;
    }

    @Transactional(readOnly = true)
    public TreeDetailsDto getTreeDetails(UUID treeId) {
        TreeDetails tree = treeDetailsRepository.findById(treeId)
                .orElseThrow(() -> new TreeNotFoundException(treeId));

        TreeDetailsDto dto = treeDetailsMapper.toDto(tree);

        // Optional: convert TreePhoto to PhotoDto using MapStruct
        List<PhotoDto> photos = tree.getPhotos().stream()
                .map(photoDtoMapper::toDto)
                .collect(Collectors.toList());

        dto.setPhotos(photos);
        return dto;
    }
}
