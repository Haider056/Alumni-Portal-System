const pool = require('../Src/Config/db');

class EventModel {
  static async createEvent(eventData) {
    try {
      const { title, description, date, timing, locations, imageURL, createdBy } = eventData;

      // Timing is displayed as-is ("06:00 PM"). Older clients sent a full Date string; that used to be
      // converted to a UTC timestamp, and anything else was silently dropped while the API still returned 201.
      const parsed = new Date(timing);
      const eventTimingFormatted = /GMT|T\d{2}:/.test(String(timing)) && !isNaN(parsed)
        ? parsed.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        : String(timing || '').trim();

      const query = `
        INSERT INTO events (eventTitle, eventDescription, eventDate, eventTiming, eventLocations, imageURL, createdBy)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [title, description, date, eventTimingFormatted, locations, imageURL, createdBy];
      const [result] = await pool.query(query, values);
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async getEventsByEmail(email) {
    try {
      const query = `
        SELECT *
        FROM events
        WHERE createdBy = (
          SELECT id FROM users WHERE email = ?
        )
      `;
      const [rows] = await pool.query(query, [email]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getAllEvents() {
    try {
      const query = `
        SELECT *
        FROM events
      `;
      const [rows] = await pool.query(query);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getEventById(eventId) {
    try {
      const query = `
        SELECT *
        FROM events
        WHERE id = ?
      `;
      const [rows] = await pool.query(query, [eventId]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
  static async deleteEvent(eventId) {
    try {
      const query = `
        DELETE FROM events
        WHERE id = ?
      `;
      const [result] = await pool.query(query, [eventId]);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = EventModel;
