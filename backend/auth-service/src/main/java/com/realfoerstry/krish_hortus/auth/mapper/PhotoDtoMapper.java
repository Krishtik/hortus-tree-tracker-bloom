package com.realfoerstry.krish_hortus.auth.mapper;

import com.realfoerstry.krish_hortus.auth.dto.PhotoDto;
import com.realfoerstry.krish_hortus.auth.entity.TreePhoto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PhotoDtoMapper {
    PhotoDto toDto(TreePhoto entity);
    TreePhoto toEntity(PhotoDto dto);
}