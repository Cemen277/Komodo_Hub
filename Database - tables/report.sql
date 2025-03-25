CREATE TABLE report (
	report_id SERIAL PRIMARY KEY,
	oraganisation_id INT REFERENCES organisation(organisation_id) ON DELETE CASCADE ON UPDATE CASCADE,
	post_id INT REFERENCES post(post_id) ON DELETE CASCADE ON UPDATE CASCADE,
	report_state VARCHAR(10) CHECK (report_state IN('pending','resolved')) DEFAULT 'pending',
	reported_by INT REFERENCES user_info(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
	created_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);