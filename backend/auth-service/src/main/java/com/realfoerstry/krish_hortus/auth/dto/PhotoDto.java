package com.realfoerstry.krish_hortus.auth.dto;
import java.util.List;
import java.util.UUID;


public class PhotoDto {
    private String photoType;
    private String fileUrl;
    private String mimeType;
    private List<String> dominantColors;

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
    public String getMimeType() {
        return mimeType;
    }
    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }
    public List<String> getDominantColors() {
        return dominantColors;
    }
    public void setDominantColors(List<String> dominantColors) {
        this.dominantColors = dominantColors;
    }
}
