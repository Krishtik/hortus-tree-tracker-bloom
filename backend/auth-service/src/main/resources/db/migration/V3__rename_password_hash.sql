-- Rename password_hash to password in users table if needed
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='password_hash') THEN
        -- If password column does not exist, rename
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='password') THEN
            ALTER TABLE users RENAME COLUMN password_hash TO password;
        ELSE
            -- If both exist, drop password_hash
            ALTER TABLE users DROP COLUMN password_hash;
        END IF;
    END IF;
END$$; 