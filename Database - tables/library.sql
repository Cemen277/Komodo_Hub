CREATE TABLE digital_library (
	library_id SERIAL PRIMARY KEY,
	organisation_id INT REFERENCES organisation(organisation_id) ON DELETE CASCADE,
	library_visibility VARCHAR(20) CHECK (library_visibility IN ('public', 'private')) NOT NULL
);