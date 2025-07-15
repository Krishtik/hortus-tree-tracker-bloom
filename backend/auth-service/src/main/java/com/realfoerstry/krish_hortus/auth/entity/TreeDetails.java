package com.realfoerstry.krish_hortus.auth.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "tree_details")
public class TreeDetails {

    @Id
    @GeneratedValue
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

    @OneToMany(mappedBy = "tree", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TreePhoto> photos = new ArrayList<>();


    // Getters and setters...
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
public void setAiGenerated(boolean aiGenerated) {
    this.isAiGenerated = aiGenerated;
}

public boolean isVerified() {
    return isVerified;
}
public void setVerified(boolean verified) {
    this.isVerified = verified;
}

public BigDecimal getVerificationScore() {
    return verificationScore;
}
public void setVerificationScore(BigDecimal verificationScore) {
    this.verificationScore = verificationScore;
}

public List<TreePhoto> getPhotos() {
    return photos;
}
public void setPhotos(List<TreePhoto> photos) {
    this.photos = photos;
}

}
