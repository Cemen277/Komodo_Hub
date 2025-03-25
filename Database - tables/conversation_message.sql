CREATE TABLE conversation_message(
	message_id SERIAL PRIMARY KEY,
	conversation_id INT REFERENCES conversation(conversation_id) ON DELETE CASCADE ON UPDATE CASCADE,
	sender_id INT REFERENCES user_info(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
	receiver_id INT REFERENCES user_info(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
	message_content TEXT NOT NULL,
	message_type VARCHAR(10) CHECK(message_type IN('text', 'image', 'video', 'file')) DEFAULT 'text',
	created_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);