import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getClubs } from '../data/getClubs.js';
import { useFavorites } from '../context/FavoritesContext.jsx';
import OrgCard from '../components/OrgCard.jsx';
import styles from './SavedOrgsPage.module.css';

/**
 * Lists only the clubs the student has saved. Unsaving a club here removes
 * its card straight away.
 */
export default function SavedOrgsPage() {
	const { favoriteIds, errorMessage } = useFavorites();
	const [clubs, setClubs] = useState(null);
	const [failed, setFailed] = useState(false);

	useEffect(() => {
		let active = true;

		async function loadClubs() {
			try {
				const data = await getClubs();

				if (active) {
					setClubs(data);
				} // end if
			} catch {
				if (active) {
					setFailed(true);
				} // end if
			} // end try/catch
		} // end loadClubs

		loadClubs();

		return () => {
			active = false;
		};
	}, []);

	const savedClubs = (clubs ?? []).filter((club) => favoriteIds.includes(club.id));

	return (
		<main className={styles.page}>
			<h1 className={styles.title}>Saved Orgs</h1>

			{errorMessage && (
				<p className={styles.error} role="alert">
					{errorMessage}
				</p>
			)}

			{failed ? (
				<p className={styles.message} role="alert">
					We couldn't load clubs right now. Try refreshing the page.
				</p>
			) : !clubs ? (
				<p className={styles.message} role="status">
					Loading saved clubs…
				</p>
			) : savedClubs.length === 0 ? (
				<div className={styles.empty}>
					<p className={styles.message}>You haven't saved any clubs yet.</p>
					<Link className={styles.browseLink} to="/">
						Browse clubs
					</Link>
				</div>
			) : (
				<ul className={styles.grid}>
					{savedClubs.map((club) => (
						<li key={club.id}>
							<OrgCard
								id={club.id}
								name={club.name}
								description={club.description}
							/>
						</li>
					))}
				</ul>
			)}
		</main>
	);
} // end SavedOrgsPage
