-- Add 2FA method column to users table
ALTER TABLE users
ADD COLUMN two_factor_method VARCHAR(10) DEFAULT '' NOT NULL;
