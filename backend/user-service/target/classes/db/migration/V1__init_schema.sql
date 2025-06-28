--
-- V1__init_schema.sql (User-Service Minimal Schema, with username)
-- ------------------------------------------------
-- This migration file creates only the tables needed for user management.
-- It is designed for a microservice that handles user profiles and roles only.
--
-- TABLE: roles
CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Insert default roles
INSERT INTO roles(name) VALUES('ROLE_USER') ON CONFLICT (name) DO NOTHING;
INSERT INTO roles(name) VALUES('ROLE_MODERATOR') ON CONFLICT (name) DO NOTHING;
INSERT INTO roles(name) VALUES('ROLE_ADMIN') ON CONFLICT (name) DO NOTHING;

-- TABLE: users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(255) UNIQUE NOT NULL,  -- Added for auth-service compatibility
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    profile_image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    is_verified BOOLEAN DEFAULT FALSE,
    subscription_type VARCHAR(50) DEFAULT 'FREE'
);

-- TABLE: user_roles (join table)
CREATE TABLE user_roles (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id BIGINT REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);
