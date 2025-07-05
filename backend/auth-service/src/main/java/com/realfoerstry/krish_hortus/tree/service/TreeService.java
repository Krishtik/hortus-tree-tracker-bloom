package com.hortus.backend.service;

import com.hortus.backend.model.Tree;
import com.hortus.backend.model.TreeCategory;
import com.hortus.backend.model.TreeImage;
import com.hortus.backend.model.TreeImageType;
import com.hortus.backend.model.User;
import com.hortus.backend.repository.TreeImageRepository;
import com.hortus.backend.repository.TreeRepository;
import com.hortus.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class TreeService {
    private static final Logger logger = LoggerFactory.getLogger(TreeService.class);

    private final TreeRepository treeRepository;
    private final TreeImageRepository treeImageRepository;
    private final UserRepository userRepository;
    private final S3Service s3Service;
    private final PlantIdentificationService plantIdentificationService;

    @Autowired
    public TreeService(TreeRepository treeRepository, 
                      TreeImageRepository treeImageRepository,
                      UserRepository userRepository,
                      S3Service s3Service,
                      PlantIdentificationService plantIdentificationService) {
        this.treeRepository = treeRepository;
        this.treeImageRepository = treeImageRepository;
        this.userRepository = userRepository;
        this.s3Service = s3Service;
        this.plantIdentificationService = plantIdentificationService;
    }

    /**
     * Get all trees with pagination
     */
    public Page<Tree> getAllTrees(Pageable pageable) {
        return treeRepository.findAll(pageable);
    }

    /**
     * Get trees by category with pagination
     */
    public Page<Tree> getTreesByCategory(TreeCategory category, Pageable pageable) {
        return treeRepository.findByCategory(category, pageable);
    }

    /**
     * Get trees by user with pagination
     */
    public Page<Tree> getTreesByUser(Long userId, Pageable pageable) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found with id: " + userId);
        }
        return treeRepository.findByUser(userOpt.get(), pageable);
    }

    /**
     * Get trees within a radius of a point
     */
    public List<Tree> getTreesWithinRadius(double latitude, double longitude, double radiusInKm) {
        return treeRepository.findTreesWithinRadius(latitude, longitude, radiusInKm);
    }

    /**
     * Get a tree by ID
     */
    public Tree getTreeById(Long id) {
        return treeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tree not found with id: " + id));
    }

    /**
     * Create a new tree with identification
     */
    @Transactional
    public Tree createTree(Tree tree, String base64MainImage, List<MultipartFile> additionalImages, Long userId) {
        // Set the user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        tree.setUser(user);
        
        // Set planted date if not provided
        if (tree.getPlantedDate() == null) {
            tree.setPlantedDate(LocalDateTime.now());
        }
        
        // Identify the tree if scientific name is not provided
        if (tree.getScientificName() == null || tree.getScientificName().isEmpty()) {
            Map<String, Object> identificationResult = plantIdentificationService.identifyPlant(
                    base64MainImage, tree.getLatitude(), tree.getLongitude());
            
            tree.setScientificName((String) identificationResult.get("scientificName"));
            tree.setCommonName((String) identificationResult.get("commonName"));
            tree.setFamily((String) identificationResult.get("family"));
            
            @SuppressWarnings("unchecked")
            List<String> medicinalUses = (List<String>) identificationResult.get("medicinalUses");
            tree.setMedicinalUses(String.join(", ", medicinalUses));
            
            @SuppressWarnings("unchecked")
            List<String> dominantColors = (List<String>) identificationResult.get("dominantColors");
            tree.setDominantColors(String.join(", ", dominantColors));
            
            tree.setIdentificationConfidence((Double) identificationResult.get("confidence"));
        }
        
        // Save the tree to get an ID
        Tree savedTree = treeRepository.save(tree);
        
        // Upload and save the main image
        String mainImageKey = s3Service.uploadBase64Image(base64MainImage, "trees/", "image/jpeg");
        String mainImageUrl = s3Service.getPublicUrl(mainImageKey);
        
        TreeImage mainTreeImage = new TreeImage();
        mainTreeImage.setTree(savedTree);
        mainTreeImage.setType(TreeImageType.TREE);
        mainTreeImage.setImageUrl(mainImageUrl);
        mainTreeImage.setS3Key(mainImageKey);
        treeImageRepository.save(mainTreeImage);
        
        // Upload and save additional images if provided
        if (additionalImages != null && !additionalImages.isEmpty()) {
            for (int i = 0; i < additionalImages.size(); i++) {
                MultipartFile file = additionalImages.get(i);
                try {
                    String key = s3Service.uploadFile(file, "trees/");
                    String url = s3Service.getPublicUrl(key);
                    
                    TreeImage additionalImage = new TreeImage();
                    additionalImage.setTree(savedTree);
                    // Assign different types based on index or metadata
                    TreeImageType type = getImageTypeByIndex(i);
                    additionalImage.setType(type);
                    additionalImage.setImageUrl(url);
                    additionalImage.setS3Key(key);
                    treeImageRepository.save(additionalImage);
                } catch (Exception e) {
                    logger.error("Error uploading additional image", e);
                }
            }
        }
        
        return savedTree;
    }

    /**
     * Update an existing tree
     */
    @Transactional
    public Tree updateTree(Long id, Tree treeDetails) {
        Tree tree = treeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tree not found with id: " + id));
        
        // Update tree details
        tree.setName(treeDetails.getName());
        tree.setCategory(treeDetails.getCategory());
        tree.setLatitude(treeDetails.getLatitude());
        tree.setLongitude(treeDetails.getLongitude());
        tree.setH3Index(treeDetails.getH3Index());
        tree.setScientificName(treeDetails.getScientificName());
        tree.setCommonName(treeDetails.getCommonName());
        tree.setFamily(treeDetails.getFamily());
        tree.setMedicinalUses(treeDetails.getMedicinalUses());
        tree.setDominantColors(treeDetails.getDominantColors());
        tree.setIdentificationConfidence(treeDetails.getIdentificationConfidence());
        
        return treeRepository.save(tree);
    }

    /**
     * Delete a tree and its images
     */
    @Transactional
    public void deleteTree(Long id) {
        Tree tree = treeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tree not found with id: " + id));
        
        // Delete images from S3 and database
        List<TreeImage> images = treeImageRepository.findByTree(tree);
        for (TreeImage image : images) {
            s3Service.deleteFile(image.getS3Key());
            treeImageRepository.delete(image);
        }
        
        // Delete the tree
        treeRepository.delete(tree);
    }

    /**
     * Add an image to a tree
     */
    @Transactional
    public TreeImage addTreeImage(Long treeId, MultipartFile file, TreeImageType type) {
        Tree tree = treeRepository.findById(treeId)
                .orElseThrow(() -> new RuntimeException("Tree not found with id: " + treeId));
        
        String key = s3Service.uploadFile(file, "trees/");
        String url = s3Service.getPublicUrl(key);
        
        TreeImage treeImage = new TreeImage();
        treeImage.setTree(tree);
        treeImage.setType(type);
        treeImage.setImageUrl(url);
        treeImage.setS3Key(key);
        
        return treeImageRepository.save(treeImage);
    }

    /**
     * Delete a tree image
     */
    @Transactional
    public void deleteTreeImage(Long imageId) {
        TreeImage image = treeImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Tree image not found with id: " + imageId));
        
        s3Service.deleteFile(image.getS3Key());
        treeImageRepository.delete(image);
    }

    /**
     * Get most common trees
     */
    public List<Object[]> getMostCommonTrees(int limit) {
        return treeRepository.findMostCommonTrees(limit);
    }

    /**
     * Get most common trees by user
     */
    public List<Object[]> getMostCommonTreesByUser(Long userId, int limit) {
        return treeRepository.findMostCommonTreesByUser(userId, limit);
    }

    /**
     * Helper method to determine image type based on index
     */
    private TreeImageType getImageTypeByIndex(int index) {
        switch (index % 4) {
            case 0: return TreeImageType.LEAVES;
            case 1: return TreeImageType.FLOWERS;
            case 2: return TreeImageType.FRUITS;
            case 3: return TreeImageType.BARK;
            default: return TreeImageType.TREE;
        }
    }
}