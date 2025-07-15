package com.realfoerstry.krish_hortus.auth.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.UUID;

@Entity
@Table(name = "trees")
public class Tree {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(name = "scientific_name", nullable = false)
    private String scientificName;

    @Column(name = "local_name")
    private String localName;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false, precision = 10, scale = 8)
    private BigDecimal latitude;

    @Column(nullable = false, precision = 11, scale = 8)
    private BigDecimal longitude;

    @Column(name = "h3_index", nullable = false)
    private String h3Index;

    private String address;

    @Column(precision = 8, scale = 2)
    private BigDecimal elevation;

    @Column(name = "height", precision = 8, scale = 2)
    private BigDecimal height;

    @Column(name = "trunk_width", precision = 8, scale = 2)
    private BigDecimal trunkWidth;

    @Column(name = "canopy_spread", precision = 8, scale = 2)
    private BigDecimal canopySpread;

    @Column(name = "tagged_by")
    private UUID taggedBy;

    @Column(name = "tagged_at")
    private Timestamp taggedAt;

    @Column(name = "updated_at")
    private Timestamp updatedAt;

    @Column(name = "is_ai_generated")
    private boolean isAiGenerated;

    @Column(name = "is_verified")
    private boolean isVerified;

    @Column(name = "verification_score", precision = 3, scale = 2)
    private BigDecimal verificationScore;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
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

    public String getH3Index() {
        return h3Index;
    }

    public void setH3Index(String h3Index) {
        this.h3Index = h3Index;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public BigDecimal getElevation() {
        return elevation;
    }

    public void setElevation(BigDecimal elevation) {
        this.elevation = elevation;
    }

    public BigDecimal getHeight() {
        return height;
    }

    public void setHeight(BigDecimal height) {
        this.height = height;
    }

    public BigDecimal getTrunkWidth() {
        return trunkWidth;
    }

    public void setTrunkWidth(BigDecimal trunkWidth) {
        this.trunkWidth = trunkWidth;
    }

    public BigDecimal getCanopySpread() {
        return canopySpread;
    }

    public void setCanopySpread(BigDecimal canopySpread) {
        this.canopySpread = canopySpread;
    }

    public UUID getTaggedBy() {
        return taggedBy;
    }

    public void setTaggedBy(UUID taggedBy) {
        this.taggedBy = taggedBy;
    }

    public Timestamp getTaggedAt() {
        return taggedAt;
    }

    public void setTaggedAt(Timestamp taggedAt) {
        this.taggedAt = taggedAt;
    }

    public Timestamp getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Timestamp updatedAt) {
        this.updatedAt = updatedAt;
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



    // Getters and setters or Lombok annotations as needed
}