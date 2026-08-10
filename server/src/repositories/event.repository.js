const pool = require("../config/db");

// create event
async function createEvent({
    title,
    description,
    location,
    eventDate,
    createdBy
}) {
    const [result] = await pool.execute(
        `
        INSERT INTO events
        (
            title,
            description,
            location,
            event_date,
            created_by
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
            title,
            description || null,
            location,
            eventDate,
            createdBy
        ]
    );

    return result.insertId;
}

// find the event by Id
async function findEventById(eventId) {
    const [rows] = await pool.execute(
        `
        SELECT
            e.id,
            e.title,
            e.description,
            e.location,
            e.event_date,
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

// Find all events
async function findAllEvents() {
    const [rows] = await pool.execute(
        `
        SELECT
            e.id,
            e.title,
            e.description,
            e.location,
            e.event_date,
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

// Update event
async function updateEvent(
    eventId,
    { title, description, location, eventDate }
) {
    const [result] = await pool.execute(
        `
        UPDATE events
        SET
            title = ?,
            description = ?,
            location = ?,
            event_date = ?
        WHERE id = ?
        `,
        [
            title,
            description || null,
            location,
            eventDate,
            eventId
        ]
    );

    return result.affectedRows;
}

// Delete event
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