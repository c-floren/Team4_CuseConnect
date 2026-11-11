
import { useEffect, useState } from 'react';
import { getEvents } from '../data/getEvents.js';
import EventCard from '../components/EventCard.jsx';
import styles from './EventsPage.module.css';

export default function EventsPage() {
  const [events, setEvents] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;

    getEvents()
      .then((data) => active && setEvents(data))
      .catch(() => active && setFailed(true));

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Upcoming Events</h1>

      <p className={styles.subtitle}>
        Discover events happening across Syracuse University.
      </p>

      {failed ? (
        <p className={styles.message} role="alert">
          We couldn't load events right now. Try refreshing the page.
        </p>
      ) : !events ? (
        <p className={styles.message} role="status">
          Loading events…
        </p>
      ) : events.length === 0 ? (
        <p className={styles.message} role="status">
          No upcoming events are available right now.
        </p>
      ) : (
        <ul className={styles.grid}>
          {events.map((event) => (
            <li key={event.id}>
              <EventCard event={event} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
