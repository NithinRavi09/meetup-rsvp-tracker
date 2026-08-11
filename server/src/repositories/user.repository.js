const pool = require("../config/db");

// This function fetches a user record by email address using parameterized query.
async function findUserByEmail(email) {
    const [rows] = await pool.execute(
        `
        SELECT id, name, email, password_hash
        FROM users
        WHERE email = ?
        LIMIT 1
        `,
        [email]
    );

    return rows[0] || null;
}

module.exports = {
    findUserByEmail
};