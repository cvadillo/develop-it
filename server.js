const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const mysql = require('mysql2');

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
// db.query(`SELECT * FROM candidates`, (err, rows) => {
// 	console.log(rows);
// });

// GET a single candidate
// db.query(`SELECT * FROM candidates WHERE id = 9`, (err, row) => {
// 	if (err) {
// 		console.log(err);
// 	}
// 	console.log(row);
// });

// DELETE a candidate
// db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, result) => {
// 	if (err) {
// 		console.log(err);
// 	}
// 	console.log(result);
// });

// CREATE a candidate
const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected)
			VALUES (?,?,?,?)`;
const params = [1, 'Ronald', 'Firbank', 1];

db.query(sql, params, (err, result) => {
	if (err) {
		console.log(err);
	}
	console.log(result);
});

// Default response for any other request (NOT FOUND)
app.use((req, res) => {
	res.status(404).end();
});

app.listen(PORT, () => {
	console.log(`server running on port ${PORT}`);
});