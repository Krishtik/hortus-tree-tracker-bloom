package com.realfoerstry.krish_hortus.auth.mapper;

import com.realfoerstry.krish_hortus.auth.dto.PhotoDto;
import com.realfoerstry.krish_hortus.auth.dto.TreeDetailsDto;
import com.realfoerstry.krish_hortus.auth.entity.TreeDetails;
import com.realfoerstry.krish_hortus.auth.entity.TreePhoto;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-15T19:00:50+0530",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.42.50.v20250628-1110, environment: Java 21.0.7 (Eclipse Adoptium)"
)
@Component
public class TreeDetailsMapperImpl implements TreeDetailsMapper {

    @Autowired
    private PhotoDtoMapper photoDtoMapper;

    @Override
    public TreeDetailsDto toDto(TreeDetails entity) {
        if ( entity == null ) {
            return null;
        }

        TreeDetailsDto treeDetailsDto = new TreeDetailsDto();

        treeDetailsDto.setTreeId( entity.getTreeId() );
        treeDetailsDto.setName( entity.getName() );
        treeDetailsDto.setScientificName( entity.getScientificName() );
        treeDetailsDto.setLocalName( entity.getLocalName() );
        treeDetailsDto.setCategory( entity.getCategory() );
        treeDetailsDto.setLatitude( entity.getLatitude() );
        treeDetailsDto.setLongitude( entity.getLongitude() );
        treeDetailsDto.setAddress( entity.getAddress() );
        treeDetailsDto.setAiGenerated( entity.isAiGenerated() );
        treeDetailsDto.setVerified( entity.isVerified() );
        treeDetailsDto.setVerificationScore( entity.getVerificationScore() );
        treeDetailsDto.setPhotos( treePhotoListToPhotoDtoList( entity.getPhotos() ) );

        return treeDetailsDto;
    }

    @Override
    public TreeDetails toEntity(TreeDetailsDto dto) {
        if ( dto == null ) {
            return null;
        }

        TreeDetails treeDetails = new TreeDetails();

        treeDetails.setTreeId( dto.getTreeId() );
        treeDetails.setName( dto.getName() );
        treeDetails.setScientificName( dto.getScientificName() );
        treeDetails.setLocalName( dto.getLocalName() );
        treeDetails.setCategory( dto.getCategory() );
        treeDetails.setLatitude( dto.getLatitude() );
        treeDetails.setLongitude( dto.getLongitude() );
        treeDetails.setAddress( dto.getAddress() );
        treeDetails.setAiGenerated( dto.isAiGenerated() );
        treeDetails.setVerified( dto.isVerified() );
        treeDetails.setVerificationScore( dto.getVerificationScore() );
        treeDetails.setPhotos( photoDtoListToTreePhotoList( dto.getPhotos() ) );

        return treeDetails;
    }

    protected List<PhotoDto> treePhotoListToPhotoDtoList(List<TreePhoto> list) {
        if ( list == null ) {
            return null;
        }

        List<PhotoDto> list1 = new ArrayList<PhotoDto>( list.size() );
        for ( TreePhoto treePhoto : list ) {
            list1.add( photoDtoMapper.toDto( treePhoto ) );
        }

        return list1;
    }

    protected List<TreePhoto> photoDtoListToTreePhotoList(List<PhotoDto> list) {
        if ( list == null ) {
            return null;
        }

        List<TreePhoto> list1 = new ArrayList<TreePhoto>( list.size() );
        for ( PhotoDto photoDto : list ) {
            list1.add( photoDtoMapper.toEntity( photoDto ) );
        }

        return list1;
    }
}
