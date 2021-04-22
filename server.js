const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const mysql = require('mysql2');
const inputCheck = require('./utils/inputCheck');

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connecting to the database
const db = mysql.createConnection(
	{
		host: 'localhost',
		user: 'root',
		password: 'password',
		database: 'election'
	},
	console.log("Connected to the election database")
);

// GET all candidates
app.get('/api/candidates', (req, res) => {
	const sql = `SELECT * FROM candidates`;

	db.query(sql, (err, rows) => {
		if(err) {
			res.status(500).json({ error: err.message });
			return;
		}
		res.json({
			message: 'Success!',
			data: rows
		});
	});
});

// GET a single candidate
app.get('/api/candidate/:id', (req, res) => {
	const sql = `SELECT * FROM candidates WHERE id = ?`;
	const params = [req.params.id];

	db.query(sql, params, (err, row) => {
		if (err) {
			res.status(500).json({ error: err.message });
			return;
		}
		res.json({
			message: "Great Success!",
			data: row
		});
	});
});



// DELETE a candidate
app.delete('/api/candidate/:id', (req, res) => {
	const sql = `DELETE FROM candidates WHERE id = ?`;
	const params = [req.params.id];

	db.query(sql, params, (err, result) => {
		if (err) {
			res.statusMessage(400).json({ error: err.message });
		} else if (!result.affectedRows) {
			res.json({
				message: "This is not the candidate you're looking for"
			});
		} else {
			res.json({
				message: "Candidate Buhlee-ted!",
				changes: result.affectedRows,
				id: req.params.id
			});
		}
	});
});

// CREATE a candidate
app.post('/api/candidate', ({ body }, res) => {
	const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
	if (errors) {
		res.status(400).json({ error: errors });
    	return;
	}

	const sql = `INSERT INTO candidates (first_name, last_name, industry_connected) VALUES (?,?,?)`;
	const params = [body.first_name, body.last_name, body.industry_connected];

	db.query(sql, params, (err, result) => {
		if (err) {
			res.status(400).json({ error: err.message });
			return;
		}
  		res.json({
    		message: 'You added a candidate!',
   			data: body
		});
	});
});

// Default response for any other request (NOT FOUND)
app.use((req, res) => {
	res.status(404).end();
});

app.listen(PORT, () => {
	console.log(`server running on port ${PORT}`);
});