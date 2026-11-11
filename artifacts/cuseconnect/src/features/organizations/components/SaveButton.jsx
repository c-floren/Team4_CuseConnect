import { useFavorites } from '../context/FavoritesContext.jsx';
import styles from './SaveButton.module.css';

/**
 * Bookmark toggle for one club. A real <button> with aria-pressed, so keyboard
 * users can toggle it with Enter or Space and screen readers announce
 * "Save <club>, toggle button, pressed / not pressed".
 */
export default function SaveButton({ clubId, clubName }) {
	const { isFavorite, toggleFavorite } = useFavorites();
	const saved = isFavorite(clubId);

	return (
		<button
			type="button"
			className={saved ? `${styles.saveButton} ${styles.saved}` : styles.saveButton}
			aria-pressed={saved}
			aria-label={`Save ${clubName}`}
			onClick={() => toggleFavorite(clubId)}
		>
			{/* Bookmark icon: outlined when not saved, filled when saved. */}
			<svg
				className={styles.icon}
				viewBox="0 0 24 24"
				aria-hidden="true"
				focusable="false"
			>
				<path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4.5L5 21V4a1 1 0 0 1 1-1z" />
			</svg>
		</button>
	);
} // end SaveButton
