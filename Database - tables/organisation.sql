CREATE TABLE organisation (
	organisation_id SERIAL PRIMARY KEY,
	organisation_name VARCHAR(255) UNIQUE NOT NULL,
	description TEXT,
	image TEXT,
	organisation_type VARCHAR(20) CHECK (organisation_type IN ('school', 'community')) NOT NULL,
	members_num INT DEFAULT 0 CHECK (members_num >= 0)
);