    -- Roles Table
    CREATE TABLE IF NOT EXISTS roles (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(20) NOT NULL UNIQUE
    );

    -- Insert default roles
    INSERT INTO roles(name) VALUES('ROLE_USER') ON CONFLICT (name) DO NOTHING;
    INSERT INTO roles(name) VALUES('ROLE_MODERATOR') ON CONFLICT (name) DO NOTHING;
    INSERT INTO roles(name) VALUES('ROLE_ADMIN') ON CONFLICT (name) DO NOTHING;

    -- Users Table (if not already compatible)
    DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='username') THEN
            ALTER TABLE users ADD COLUMN username VARCHAR(255) UNIQUE;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='password') THEN
            ALTER TABLE users ADD COLUMN password VARCHAR(255);
        END IF;
        -- Add id as BIGSERIAL if not present (skip if using UUID)
    END$$;

    -- User-Roles Join Table
    CREATE TABLE IF NOT EXISTS user_roles (
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        role_id BIGINT REFERENCES roles(id) ON DELETE CASCADE,
        PRIMARY KEY (user_id, role_id)
    );

    -- Indexes
    CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
    CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);