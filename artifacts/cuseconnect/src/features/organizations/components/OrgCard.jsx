import styles from './OrgCard.module.css';

/**
 * Not a link yet: there are no club detail pages to open. When there are,
 * wrap this in a <Link> and bring back the hover state from the mockup.
 */
export default function OrgCard({ name, description }) {
  return (
    <article className={styles.card}>
      <div className={styles.art} aria-hidden="true">
        {name.charAt(0)}
      </div>
      <h2 className={styles.name}>{name}</h2>
      <p className={styles.blurb}>{description}</p>
    </article>
  );
}
