import { createContext, useContext, useState } from 'react';
import { FavoritesError, loadFavoriteIds, saveFavoriteIds } from '../data/FavoritesStorage.js';

const FavoritesContext = createContext(null);

/**
 * Holds the student's saved clubs for the whole app, so a club saved on the
 * Explore page shows as saved on the Saved Orgs page too.
 */
export function FavoritesProvider({ children }) {
	// Read storage once, on first render.
	const [favoriteIds, setFavoriteIds] = useState(loadFavoriteIds);
	const [errorMessage, setErrorMessage] = useState('');

	function isFavorite(clubId) {
		return favoriteIds.includes(clubId);
	} // end isFavorite

	/**
	 * Saves the club if it isn't saved yet, otherwise removes it. The screen
	 * only changes once storage accepts the change, so it never shows a club
	 * as saved when it isn't.
	 */
	function toggleFavorite(clubId) {
		const nextIds = isFavorite(clubId)
			? favoriteIds.filter((id) => id !== clubId)
			: [...favoriteIds, clubId];

		try {
			saveFavoriteIds(nextIds);
			setFavoriteIds(nextIds);
			setErrorMessage('');
		} catch (error) {
			if (!(error instanceof FavoritesError)) {
				throw error;
			} // end if

			setErrorMessage(
				"We couldn't update your saved clubs. Your browser may be blocking storage.",
			);
		} // end try/catch
	} // end toggleFavorite

	const value = { favoriteIds, isFavorite, toggleFavorite, errorMessage };

	return (
		<FavoritesContext.Provider value={value}>
			{children}
		</FavoritesContext.Provider>
	);
} // end FavoritesProvider

export function useFavorites() {
	const context = useContext(FavoritesContext);

	if (!context) {
		throw new FavoritesError('useFavorites must be used inside <FavoritesProvider>.');
	} // end if

	return context;
} // end useFavorites
