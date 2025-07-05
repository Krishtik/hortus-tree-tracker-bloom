package com.hortus.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "trees")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Tree {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @Enumerated(EnumType.STRING)
    @NotNull
    private TreeCategory category;

    @NotNull
    private Double latitude;

    @NotNull
    private Double longitude;

    private String h3Index;

    private String scientificName;

    private String commonName;

    private String family;

    @ElementCollection
    @CollectionTable(name = "tree_medicinal_uses", joinColumns = @JoinColumn(name = "tree_id"))
    @Column(name = "medicinal_use")
    private Set<String> medicinalUses = new HashSet<>();

    @ElementCollection
    @CollectionTable(name = "tree_dominant_colors", joinColumns = @JoinColumn(name = "tree_id"))
    @Column(name = "color")
    private Set<String> dominantColors = new HashSet<>();

    private Double identificationConfidence;

    @OneToMany(mappedBy = "tree", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<TreeImage> images = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDateTime plantedDate;

    @PrePersist
    protected void onCreate() {
        plantedDate = LocalDateTime.now();
    }
}