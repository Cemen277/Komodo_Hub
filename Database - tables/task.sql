CREATE TABLE task (
	task_id SERIAL PRIMARY KEY,
	programme_id INT REFERENCES programme(programme_id) ON DELETE CASCADE,
	organisation_id INT REFERENCES organisation(organisation_id) ON DELETE CASCADE,
	task_name VARCHAR(255) NOT NULL,
	task_description TEXT NOT NULL,
	creator INT REFERENCES user_info(user_id) ON DELETE SET NULL,
	created_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	
);