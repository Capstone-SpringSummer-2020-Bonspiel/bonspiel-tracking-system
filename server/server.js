'use strict'

const express = require('express');
const compression = require('compression');

process.env.NODE_CONFIG_DIR = './config'
const config = require('config');

const PORT = process.env.PORT || 8080
const HOST = '0.0.0.0';
const APP_FOLDER = 'dist/app'

const app = express();
app.use(compression());

// Setup postgres db connection
const { Pool, Client } = require('pg');
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'postgres',
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
});

app.get('/api/sqltest', (req, res) => {
    // Test postgres db connection
    pool.query('SELECT * FROM public.curlingevent ORDER BY id ASC', (err, _res) => {
        console.log(err, _res);
        res.send(_res);
    });
});

app.get('*.*', express.static(APP_FOLDER, { maxAge: '1y' }));

app.all('*', (req, res) => {
    res.status(200).sendFile('/', { root: APP_FOLDER });
})

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
console.log("Frontend Environment", config.env);
console.log("NODE_ENV", process.env.NODE_ENV);
console.log("API URL", config.backend.url);