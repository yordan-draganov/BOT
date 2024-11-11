const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname)));

const pool = new Pool({
    user: 'postgres',
    host: 'db', 
    database: 'slot_machine',
    password: '4008',
    port: 5432,
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/saveGame', async (req, res) => {
    try {
        const { result, reels, spins } = req.body;
        const query = 'INSERT INTO game_sessions (result, reels, spins) VALUES ($1, $2, $3)';
        await pool.query(query, [result, reels, spins]);
        res.status(201).send('Game session recorded');
    } catch (err) {
        console.error('Error recording game session:', err);
        res.status(500).send('Error recording game session');
    }
});

app.get('/history', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM game_sessions ORDER BY timestamp DESC');
        
        let html = `
            <html>
            <head>
                <title>Game History</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    table { border-collapse: collapse; width: 100%; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    tr:nth-child(even) { background-color: #f9f9f9; }
                </style>
            </head>
            <body>
                <h1>Game History</h1>
                <table>
                    <tr>
                        <th>ID</th>
                        <th>Timestamp</th>
                        <th>Result</th>
                        <th>Reels</th>
                        <th>Spins</th>
                    </tr>
        `;
        
        result.rows.forEach(row => {
            html += `
                <tr>
                    <td>${row.id}</td>
                    <td>${new Date(row.timestamp).toLocaleString()}</td>
                    <td>${row.result}</td>
                    <td>${row.reels ? row.reels.join(', ') : 'N/A'}</td>
                    <td>${row.spins}</td>
                </tr>
            `;
        });
        
        html += `
                </table>
            </body>
            </html>
        `;
        
        res.send(html);
    } catch (err) {
        console.error('Error fetching game history:', err);
        res.status(500).send('Error fetching game history');
    }
});

app.get('/api/history', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM game_sessions ORDER BY timestamp DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching game history:', err);
        res.status(500).send('Error fetching game history');
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`View game history at http://localhost:${PORT}/history`);
});
