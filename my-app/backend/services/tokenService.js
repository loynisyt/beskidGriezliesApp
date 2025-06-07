const crypto = require('crypto');
const db = require('../db'); // Assume a db module for querying the database

const TOKEN_EXPIRATION_HOURS = 24;

// Hash a token using SHA-256 and return hex string
function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// Store a token in the database with userId and expiration
async function storeToken(userId, token) {
  const tokenHash = hashToken(token);
  const issuedAt = new Date();
  const expiresAt = new Date(issuedAt.getTime() + TOKEN_EXPIRATION_HOURS * 60 * 60 * 1000);

  const query = `
    INSERT INTO user_tokens (user_id, token_hash, issued_at, expires_at)
    VALUES ($1, $2, $3, $4)
  `;
  await db.query(query, [userId, tokenHash, issuedAt, expiresAt]);
}

// Validate a token by checking if its hash exists and is not expired
async function validateToken(token) {
  const tokenHash = hashToken(token);
  const query = `
    SELECT user_id FROM user_tokens
    WHERE token_hash = $1 AND expires_at > NOW()
  `;
  const result = await db.query(query, [tokenHash]);
  if (result.rows.length === 1) {
    return result.rows[0].user_id;
  }
  return null;
}

// Remove expired tokens from the database for a specific user
async function removeExpiredTokens(userId) {
  const query = `
    DELETE FROM user_tokens WHERE expires_at <= NOW() and user_id=${userId}
  `;
  await db.query(query);
}

// Remove all expired tokens from the database
async function removeAllExpiredTokens() {
  const query = `
    DELETE FROM user_tokens WHERE expires_at <= NOW()
  `;
  await db.query(query);
}

module.exports = {
  storeToken,
  validateToken,
  removeExpiredTokens,
  removeAllExpiredTokens,
};
