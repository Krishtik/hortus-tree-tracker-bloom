package com.realfoerstry.krish_hortus.auth.mapper;

import com.realfoerstry.krish_hortus.auth.dto.PhotoDto;
import com.realfoerstry.krish_hortus.auth.dto.TreeDetailsDto;
import com.realfoerstry.krish_hortus.auth.entity.TreeDetails;
import com.realfoerstry.krish_hortus.auth.entity.TreePhoto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring", uses = PhotoDtoMapper.class)
public interface TreeDetailsMapper {
    TreeDetailsMapper INSTANCE = Mappers.getMapper(TreeDetailsMapper.class);

    @Mapping(source = "treeId", target = "treeId")
        // no need to map other same-named fields
    TreeDetailsDto toDto(TreeDetails entity);

    TreeDetails toEntity(TreeDetailsDto dto);
}
