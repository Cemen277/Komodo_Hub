CREATE TABLE library_article (
	article_id SERIAL PRIMARY KEY,
	library_id INT REFERENCES digital_library(library_id) ON DELETE CASCADE,
	article_header VARCHAR(255) NOT NULL,
	cover_image TEXT,
	media_url TEXT,
	article_text TEXT NOT NULL,
	creator INT REFERENCES user_info(user_id) ON DELETE SET NULL,
	created_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);