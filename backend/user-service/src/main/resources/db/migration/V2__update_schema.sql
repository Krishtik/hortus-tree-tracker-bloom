-- V2__update_schema.sql
-- Add missing columns or constraints for user-service schema evolution

-- Add username column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='users' AND column_name='username'
    ) THEN
        ALTER TABLE users ADD COLUMN username VARCHAR(255) UNIQUE NOT NULL DEFAULT gen_random_uuid()::text;
    END IF;
END$$;

-- Add password column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='users' AND column_name='password'
    ) THEN
        ALTER TABLE users ADD COLUMN password VARCHAR(255) NOT NULL DEFAULT '';
    END IF;
END$$;

-- Add index on username if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes WHERE tablename='users' AND indexname='idx_users_username'
    ) THEN
        CREATE INDEX idx_users_username ON users(username);
    END IF;
END$$;