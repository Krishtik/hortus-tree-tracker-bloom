package com.realfoerstry.krish_hortus.auth.mapper;

import com.realfoerstry.krish_hortus.auth.dto.PhotoDto;
import com.realfoerstry.krish_hortus.auth.entity.TreePhoto;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-15T18:05:13+0530",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.7 (Eclipse Adoptium)"
)
@Component
public class PhotoDtoMapperImpl implements PhotoDtoMapper {

    @Override
    public PhotoDto toDto(TreePhoto entity) {
        if ( entity == null ) {
            return null;
        }

        PhotoDto photoDto = new PhotoDto();

        photoDto.setPhotoType( entity.getPhotoType() );
        photoDto.setFileUrl( entity.getFileUrl() );
        photoDto.setMimeType( entity.getMimeType() );
        List<String> list = entity.getDominantColors();
        if ( list != null ) {
            photoDto.setDominantColors( new ArrayList<String>( list ) );
        }

        return photoDto;
    }

    @Override
    public TreePhoto toEntity(PhotoDto dto) {
        if ( dto == null ) {
            return null;
        }

        TreePhoto treePhoto = new TreePhoto();

        treePhoto.setPhotoType( dto.getPhotoType() );
        treePhoto.setFileUrl( dto.getFileUrl() );
        treePhoto.setMimeType( dto.getMimeType() );
        List<String> list = dto.getDominantColors();
        if ( list != null ) {
            treePhoto.setDominantColors( new ArrayList<String>( list ) );
        }

        return treePhoto;
    }
}
