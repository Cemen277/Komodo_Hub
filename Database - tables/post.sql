CREATE TABLE post(
	post_id SERIAL PRIMARY KEY,
	user_id INT REFERENCES user_info(user_id) ON DELETE CASCADE,
	media_url TEXT NOT NULL,    -- Supports images or videos 
	post_text VARCHAR(500) NOT NULL,
	create_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);