const pool = require("../config/db");

// This function checks if an RSVP record exists for a specific user and event.
async function findRsvp(userId, eventId) {
    const [rows] = await pool.execute(
        `
        SELECT id, user_id, event_id, status, created_at, updated_at
        FROM rsvps
        WHERE user_id = ? AND event_id = ?
        LIMIT 1
        `,
        [userId, eventId]
    );

    return rows[0] || null;
}

// This function inserts a new RSVP record for a user and event.
async function createRsvp(userId, eventId, status) {
    const [result] = await pool.execute(
        `
        INSERT INTO rsvps
        (user_id, event_id, status)
        VALUES (?, ?, ?)
        `,
        [userId, eventId, status]
    );

    return result.insertId;
}

// This function updates the status of an existing RSVP record.
async function updateRsvp(userId, eventId, status) {
    const [result] = await pool.execute(
        `
        UPDATE rsvps
        SET status = ?
        WHERE user_id = ? AND event_id = ?
        `,
        [status, userId, eventId]
    );

    return result.affectedRows;
}

// This function fetches all RSVPs for an event along with user details.
async function findRsvpsByEventId(eventId) {
    const [rows] = await pool.execute(
        `
        SELECT
            r.id,
            r.user_id,
            r.event_id,
            r.status,
            r.created_at,
            r.updated_at,
            u.name,
            u.email
        FROM rsvps r
        INNER JOIN users u
            ON r.user_id = u.id
        WHERE r.event_id = ?
        ORDER BY r.created_at ASC
        `,
        [eventId]
    );

    return rows;
}

module.exports = {
    findRsvp,
    createRsvp,
    updateRsvp,
    findRsvpsByEventId
};