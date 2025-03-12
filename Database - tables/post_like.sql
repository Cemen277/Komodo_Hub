CREATE TABLE post_like (
	post_id INT REFERENCES post(post_id) ON DELETE CASCADE ON UPDATE CASCADE,
	user_id INT REFERENCES user_info(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
	created_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (post_id, user_id)    -- Ensures each user can like only once
);