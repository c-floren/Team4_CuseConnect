import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FavoritesError, loadFavoriteIds, saveFavoriteIds } from './FavoritesStorage.js';

beforeEach(() => {
	window.localStorage.clear();
	vi.stubEnv('VITE_DEMO_MODE', 'true');
});

afterEach(() => {
	vi.restoreAllMocks();
	vi.unstubAllEnvs();
});

describe('loadFavoriteIds', () => {
	it('returns an empty list when nothing is saved', () => {
		expect(loadFavoriteIds()).toEqual([]);
	});

	it('returns what saveFavoriteIds stored', () => {
		saveFavoriteIds([3, 1]);

		expect(loadFavoriteIds()).toEqual([3, 1]);
	});

	it('treats unreadable data as nothing saved', () => {
		window.localStorage.setItem('cuseconnect.favorites.demo', '{not json');

		expect(loadFavoriteIds()).toEqual([]);
	});

	it('drops values that cannot be club ids', () => {
		window.localStorage.setItem('cuseconnect.favorites.demo', JSON.stringify([1, null, {}, 'a']));

		expect(loadFavoriteIds()).toEqual([1, 'a']);
	});

	it('keeps demo and live favorites apart', () => {
		saveFavoriteIds([1]);
		vi.stubEnv('VITE_DEMO_MODE', 'false');

		expect(loadFavoriteIds()).toEqual([]);
	});
});

describe('saveFavoriteIds', () => {
	it('throws FavoritesError when the browser refuses to store', () => {
		vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
			throw new Error('QuotaExceededError');
		});

		expect(() => saveFavoriteIds([1])).toThrow(FavoritesError);
	});
});
