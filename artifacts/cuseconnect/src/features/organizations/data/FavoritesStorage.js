import { isDemoMode } from '../../../lib/demoMode.js';

/**
 * The only place that decides where saved clubs are kept. Everything else
 * calls loadFavoriteIds() and saveFavoriteIds() and never touches storage.
 *
 * For now favorites live in the browser (localStorage), because there is no
 * login yet to tie them to a student. When login lands, swap these two
 * functions for a Supabase `favorites` table and nothing else has to change.
 */

// Demo and live clubs can share ids, so each mode gets its own key.
const LIVE_KEY = 'cuseconnect.favorites';
const DEMO_KEY = 'cuseconnect.favorites.demo';

/**
 * Thrown when saved clubs can't be written, for example when the browser
 * blocks storage in a private window or storage is full.
 */
export class FavoritesError extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = 'FavoritesError';
	} // end constructor
} // end FavoritesError

function storageKey() {
	return isDemoMode() ? DEMO_KEY : LIVE_KEY;
} // end storageKey

/**
 * Returns the ids of the clubs the student has saved. Missing or unreadable
 * data counts as "nothing saved yet" rather than an error, so a bad value in
 * storage can never stop the page from loading.
 */
export function loadFavoriteIds() {
	try {
		const stored = JSON.parse(window.localStorage.getItem(storageKey()));

		if (!Array.isArray(stored)) {
			return [];
		} // end if

		// Keep only values that can be club ids.
		return stored.filter((id) => typeof id === 'number' || typeof id === 'string');
	} catch {
		return [];
	} // end try/catch
} // end loadFavoriteIds

/**
 * Replaces the saved list with favoriteIds. Throws FavoritesError if the
 * browser refuses to store it.
 */
export function saveFavoriteIds(favoriteIds) {
	try {
		window.localStorage.setItem(storageKey(), JSON.stringify(favoriteIds));
	} catch (cause) {
		throw new FavoritesError('Could not save your clubs in this browser.', { cause });
	} // end try/catch
} // end saveFavoriteIds
