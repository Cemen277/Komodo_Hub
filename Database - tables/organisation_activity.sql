CREATE TABLE organisation_activity (
	activity_id SERIAL PRIMARY KEY,
	organisation_id INT REFERENCES organisation(organisation_id) ON DELETE CASCADE,
	programme_id INT REFERENCES programme(programme_id) ON DELETE CASCADE,
	activity_header VARCHAR(255) NOT NULL,
	cover_image TEXT,
	media_url TEXT,   -- Stores images or videos
	activity_text TEXT NOT NULL,
	creator INT REFERENCES user_info(user_id) ON DELETE SET NULL,
	created_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP	
)