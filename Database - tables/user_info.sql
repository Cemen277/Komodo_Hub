CREATE TABLE user_info (
	user_id SERIAL PRIMARY KEY,
	email VARCHAR(255) NOT NULL,
	full_name VARCHAR(255) NOT NULL,
	password TEXT NOT NULL,
	image TEXT,
	organisation_id INT,
	programme_id INT,
	user_type VARCHAR(20) CHECK (user_type IN ('student', 'regular user', 'super admin', 'teacher admin')) NOT NULL,
	created_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	
	FOREIGN KEY (organisation_id) REFERENCES organisation(organisation_id) ON DELETE SET NULL,
	FOREIGN KEY (programme_id) REFERENCES programme(programme_id) ON DELETE SET NULL
);