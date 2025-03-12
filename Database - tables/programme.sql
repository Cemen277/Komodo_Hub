CREATE TABLE programme (
	programme_id SERIAL PRIMARY KEY,
	organisation_id INT NOT NULL,
	programme_name VARCHAR(255) UNIQUE NOT NULL,
	FOREIGN KEY (organisation_id) REFERENCES organisation(organisation_id) ON DELETE CASCADE
);