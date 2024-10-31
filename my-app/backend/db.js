// backend/db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'capitan',
  host: 'localhost',
  database: 'beskidgriezlies',
  password: 'loynis2007',
  port: 5432,
});

pool.connect()
  .then(() => console.log('Connected to PostgreSQL database!'))
  .catch(err => console.error('Database connection error:', err.stack));

module.exports = pool;