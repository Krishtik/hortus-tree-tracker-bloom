-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    profile_image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    subscription_type VARCHAR(50) DEFAULT 'FREE'
);

-- Trees Table (Main Entity)
CREATE TABLE trees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    scientific_name VARCHAR(255) NOT NULL,
    local_name VARCHAR(255),
    category VARCHAR(50) CHECK (category IN ('farm', 'community', 'nursery')),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    h3_index VARCHAR(15) NOT NULL,
    address TEXT,
    elevation DECIMAL(8, 2),
    height DECIMAL(8, 2),
    trunk_width DECIMAL(8, 2),
    canopy_spread DECIMAL(8, 2),
    tagged_by UUID REFERENCES users(id),
    tagged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_ai_generated BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_score DECIMAL(3, 2)
);

-- Tree Photos
CREATE TABLE tree_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tree_id UUID REFERENCES trees(id) ON DELETE CASCADE,
    photo_type VARCHAR(50) CHECK (photo_type IN ('tree', 'leaves', 'bark', 'fruit', 'flower')),
    file_url TEXT NOT NULL,
    s3_key VARCHAR(255) NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dominant_colors TEXT[]
);

-- Tree Taxonomy
CREATE TABLE tree_taxonomy (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tree_id UUID REFERENCES trees(id) ON DELETE CASCADE,
    kingdom VARCHAR(100),
    family VARCHAR(100),
    genus VARCHAR(100),
    species VARCHAR(100)
);

-- Tree Metadata
CREATE TABLE tree_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tree_id UUID REFERENCES trees(id) ON DELETE CASCADE,
    uses TEXT[],
    medicinal_benefits TEXT[],
    ecological_relevance TEXT,
    cultural_significance TEXT,
    traditional_uses TEXT[],
    seasonal_behavior TEXT
);

-- Tree Logs
CREATE TABLE tree_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tree_id UUID REFERENCES trees(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    action_type VARCHAR(50),
    changes JSONB,
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    related_tree_id UUID REFERENCES trees(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Region Analytics
CREATE TABLE region_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    h3_index VARCHAR(15) NOT NULL,
    tree_count INTEGER DEFAULT 0,
    species_diversity INTEGER DEFAULT 0,
    most_common_species VARCHAR(255),
    total_carbon_sequestration DECIMAL(12, 2),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(h3_index)
);

-- Indexes

-- Trees
CREATE INDEX idx_trees_h3_index ON trees(h3_index);
CREATE INDEX idx_trees_location ON trees(latitude, longitude);
CREATE INDEX idx_trees_category ON trees(category);
CREATE INDEX idx_trees_tagged_by ON trees(tagged_by);
CREATE INDEX idx_trees_scientific_name ON trees(scientific_name);

-- Tree Photos
CREATE INDEX idx_tree_photos_tree_id ON tree_photos(tree_id);
CREATE INDEX idx_tree_photos_photo_type ON tree_photos(photo_type);

-- Tree Taxonomy
CREATE INDEX idx_tree_taxonomy_tree_id ON tree_taxonomy(tree_id);
CREATE INDEX idx_tree_taxonomy_family ON tree_taxonomy(family);
CREATE INDEX idx_tree_taxonomy_genus ON tree_taxonomy(genus);

-- Tree Metadata
CREATE INDEX idx_tree_metadata_tree_id ON tree_metadata(tree_id);

-- Tree Logs
CREATE INDEX idx_tree_logs_tree_id ON tree_logs(tree_id);
CREATE INDEX idx_tree_logs_user_id ON tree_logs(user_id);
CREATE INDEX idx_tree_logs_action_type ON tree_logs(action_type);
CREATE INDEX idx_tree_logs_created_at ON tree_logs(created_at);

-- Notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_type ON notifications(type);

-- Region Analytics
CREATE INDEX idx_region_analytics_h3_index ON region_analytics(h3_index);