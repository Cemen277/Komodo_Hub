CREATE TABLE completed_task (
	task_id INT,
	user_id INT,
	grade INT,
	feedback VARCHAR(255),
	created_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (task_id, user_id),
	FOREIGN KEY (task_id) REFERENCES task(task_id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (user_id) REFERENCES user_info(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);