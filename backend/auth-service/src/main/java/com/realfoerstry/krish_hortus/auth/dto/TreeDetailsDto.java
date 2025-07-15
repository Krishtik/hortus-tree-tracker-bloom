package com.realfoerstry.krish_hortus.auth.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public class TreeDetailsDto {
    private UUID treeId;
    private String name;
    private String scientificName;
    private String localName;
    private String category;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String address;
    private boolean isAiGenerated;
    private boolean isVerified;
    private BigDecimal verificationScore;
    private List<PhotoDto> photos;

    public UUID getTreeId() {
        return treeId;
    }
    public void setTreeId(UUID treeId) {
        this.treeId = treeId;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getScientificName() {
        return scientificName;
    }
    public void setScientificName(String scientificName) {
        this.scientificName = scientificName;
    }
    public String getLocalName() {
        return localName;
    }
    public void setLocalName(String localName) {
        this.localName = localName;
    }
    public String getCategory() {
        return category;
    }
    public void setCategory(String category) {
        this.category = category;
    }
    public BigDecimal getLatitude() {
        return latitude;
    }
    public void setLatitude(BigDecimal latitude) {
        this.latitude = latitude;
    }
    public BigDecimal getLongitude() {
        return longitude;
    }
    public void setLongitude(BigDecimal longitude) {
        this.longitude = longitude;
    }
    public String getAddress() {
        return address;
    }
    public void setAddress(String address) {
        this.address = address;
    }
    public boolean isAiGenerated() {
        return isAiGenerated;
    }
    public void setAiGenerated(boolean isAiGenerated) {
        this.isAiGenerated = isAiGenerated;
    }
    public boolean isVerified() {
        return isVerified;
    }
    public void setVerified(boolean isVerified) {
        this.isVerified = isVerified;
    }
    public BigDecimal getVerificationScore() {
        return verificationScore;
    }
    public void setVerificationScore(BigDecimal verificationScore) {
        this.verificationScore = verificationScore;
    }
    public List<PhotoDto> getPhotos() {
        return photos;
    }
    public void setPhotos(List<PhotoDto> photos) {
        this.photos = photos;
    }






}
