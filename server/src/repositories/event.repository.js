const pool = require("../config/db");

// This function creates a new event in the database using parameterized queries.
async function createEvent({
    title,
    description,
    location,
    eventDate,
    eventEndDate,
    createdBy
}) {
    // Execute parameterized SQL query to insert new event record
    const [result] = await pool.execute(
        `
        INSERT INTO events
        (
            title,
            description,
            location,
            event_date,
            event_end_date,
            created_by
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
            title,
            description || null,
            location,
            eventDate,
            eventEndDate,
            createdBy
        ]
    );

    return result.insertId;
}

// This function fetches a single event by ID along with creator information using parameterized query.
async function findEventById(eventId) {
    const [rows] = await pool.execute(
        `
        SELECT
            e.id,
            e.title,
            e.description,
            e.location,
            e.event_date,
            e.event_end_date,
            e.created_by,
            e.created_at,
            e.updated_at,
            u.name AS creator_name
        FROM events e
        INNER JOIN users u
            ON e.created_by = u.id
        WHERE e.id = ?
        `,
        [eventId]
    );

    return rows[0] || null;
}

// This function fetches all events sorted by event date.
async function findAllEvents() {
    const [rows] = await pool.execute(
        `
        SELECT
            e.id,
            e.title,
            e.description,
            e.location,
            e.event_date,
            e.event_end_date,
            e.created_by,
            e.created_at,
            e.updated_at,
            u.name AS creator_name
        FROM events e
        INNER JOIN users u
            ON e.created_by = u.id
        ORDER BY e.event_date ASC
        `
    );

    return rows;
}

// This function updates event details by event ID using parameterized queries.
async function updateEvent(
    eventId,
    { title, description, location, eventDate, eventEndDate }
) {
    const [result] = await pool.execute(
        `
        UPDATE events
        SET
            title = ?,
            description = ?,
            location = ?,
            event_date = ?,
            event_end_date = ?
        WHERE id = ?
        `,
        [
            title,
            description || null,
            location,
            eventDate,
            eventEndDate,
            eventId
        ]
    );

    return result.affectedRows;
}

// This function deletes an event from the database by ID using parameterized query.
async function deleteEvent(eventId) {
    const [result] = await pool.execute(
        `
        DELETE FROM events
        WHERE id = ?
        `,
        [eventId]
    );

    return result.affectedRows;
}

module.exports = {
    createEvent,
    findEventById,
    findAllEvents,
    updateEvent,
    deleteEvent
};