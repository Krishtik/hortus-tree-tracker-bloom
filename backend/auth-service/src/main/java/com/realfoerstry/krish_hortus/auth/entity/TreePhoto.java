package com.realfoerstry.krish_hortus.auth.entity;

import jakarta.persistence.*;
import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "tree_photos")
public class TreePhoto {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tree_id")
    private TreeDetails tree;

    @Column(name = "photo_type", nullable = false)
    private String photoType;

    @Column(name = "file_url", nullable = false)
    private String fileUrl;

    @Column(name = "s3_key", nullable = false)
    private String s3Key;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "mime_type")
    private String mimeType;

    @Column(name = "uploaded_at")
    private Timestamp uploadedAt;

    @ElementCollection
    @CollectionTable(name = "photo_dominant_colors", joinColumns = @JoinColumn(name = "photo_id"))
    @Column(name = "color")
    private List<String> dominantColors;

    // --- Getters and Setters ---

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public TreeDetails getTree() {
        return tree;
    }

    public void setTree(TreeDetails tree) {
        this.tree = tree;
    }

    public String getPhotoType() {
        return photoType;
    }

    public void setPhotoType(String photoType) {
        this.photoType = photoType;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }

    public String getS3Key() {
        return s3Key;
    }

    public void setS3Key(String s3Key) {
        this.s3Key = s3Key;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public String getMimeType() {
        return mimeType;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    public Timestamp getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(Timestamp uploadedAt) {
        this.uploadedAt = uploadedAt;
    }

    public List<String> getDominantColors() {
        return dominantColors;
    }

    public void setDominantColors(List<String> dominantColors) {
        this.dominantColors = dominantColors;
    }
}
