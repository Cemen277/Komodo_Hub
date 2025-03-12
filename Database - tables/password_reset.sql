CREATE TABLE password_reset (
	reset_id SERIAL PRIMARY KEY,
	user_id INT REFERENCES user_info(user_id) ON DELETE CASCADE,
	reset_token VARCHAR(64) UNIQUE NOT NULL,
	created_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	expires_timestamp TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '30 minutes')
	
);