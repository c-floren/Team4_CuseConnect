
import styles from './EventCard.module.css';

export default function EventCard({ event }) {
  const eventDate = new Date(event.event_date);

  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <article className={styles.card}>
      <div className={styles.date}>
        <span>{formattedDate}</span>
        <span>{formattedTime}</span>
      </div>

      <h2 className={styles.title}>{event.title}</h2>

      <p className={styles.description}>
        {event.description}
      </p>

      <div className={styles.details}>
        <span>📍 {event.location}</span>
        <span>🏫 {event.club?.name || 'Student Organization'}</span>
      </div>
    </article>
  );
}
