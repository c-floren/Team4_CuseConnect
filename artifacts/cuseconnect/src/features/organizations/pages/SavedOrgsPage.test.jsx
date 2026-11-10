import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../../../App.jsx';

/**
 * Covers the acceptance criteria for "Save favorite organizations", using
 * demo clubs so nothing touches the network.
 */
function renderApp(route = '/') {
	return {
		user: userEvent.setup(),
		...render(
			<MemoryRouter initialEntries={[route]}>
				<App />
			</MemoryRouter>,
		),
	};
} // end renderApp

const clubsLoaded = () => screen.findAllByRole('article');
const saveButton = (clubName) => screen.getByRole('button', { name: `Save ${clubName}` });
const cardNames = () =>
	screen.getAllByRole('article').map((card) => within(card).getByRole('heading').textContent);

beforeEach(() => {
	window.localStorage.clear();
	vi.stubEnv('VITE_DEMO_MODE', 'true');
});

afterEach(() => {
	vi.restoreAllMocks();
	vi.unstubAllEnvs();
});

describe('saving a club', () => {
	it('marks the club as saved when the bookmark is clicked', async () => {
		const { user } = renderApp('/');
		await clubsLoaded();

		expect(saveButton('SU Robotics Club')).toHaveAttribute('aria-pressed', 'false');

		await user.click(saveButton('SU Robotics Club'));

		expect(saveButton('SU Robotics Club')).toHaveAttribute('aria-pressed', 'true');
	});

	it('removes the club when the bookmark is clicked again', async () => {
		const { user } = renderApp('/');
		await clubsLoaded();

		await user.click(saveButton('SU Robotics Club'));
		await user.click(saveButton('SU Robotics Club'));

		expect(saveButton('SU Robotics Club')).toHaveAttribute('aria-pressed', 'false');
	});

	it('toggles from the keyboard', async () => {
		const { user } = renderApp('/');
		await clubsLoaded();

		saveButton('SU Robotics Club').focus();
		await user.keyboard('{Enter}');

		expect(saveButton('SU Robotics Club')).toHaveAttribute('aria-pressed', 'true');
	});

	it('shows a clear message when the club cannot be saved', async () => {
		vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
			throw new Error('QuotaExceededError');
		});
		const { user } = renderApp('/');
		await clubsLoaded();

		await user.click(saveButton('SU Robotics Club'));

		expect(screen.getByRole('alert')).toHaveTextContent("We couldn't update your saved clubs.");
		expect(saveButton('SU Robotics Club')).toHaveAttribute('aria-pressed', 'false');
	});
});

describe('Saved Orgs page', () => {
	it('lists only saved clubs when opened from the sidebar', async () => {
		const { user } = renderApp('/');
		await clubsLoaded();
		await user.click(saveButton('SU Robotics Club'));

		await user.click(screen.getByRole('link', { name: 'Saved Orgs' }));

		expect(screen.getByRole('heading', { level: 1, name: 'Saved Orgs' })).toBeInTheDocument();
		await clubsLoaded();
		expect(cardNames()).toEqual(['SU Robotics Club']);
	});

	it('shows an empty state with a way to browse clubs', async () => {
		renderApp('/saved');

		expect(await screen.findByText("You haven't saved any clubs yet.")).toBeInTheDocument();
		expect(screen.getByRole('link', { name: 'Browse clubs' })).toHaveAttribute('href', '/');
	});

	it('removes a card when the club is unsaved', async () => {
		const { user } = renderApp('/');
		await clubsLoaded();
		await user.click(saveButton('SU Robotics Club'));
		await user.click(screen.getByRole('link', { name: 'Saved Orgs' }));
		await clubsLoaded();

		await user.click(saveButton('SU Robotics Club'));

		expect(screen.queryByRole('article')).toBeNull();
		expect(screen.getByText("You haven't saved any clubs yet.")).toBeInTheDocument();
	});

	it('keeps saved clubs after a page refresh', async () => {
		const { user, unmount } = renderApp('/');
		await clubsLoaded();
		await user.click(saveButton('SU Robotics Club'));

		// Unmounting and rendering again is the same as reloading the page.
		unmount();
		renderApp('/saved');

		await clubsLoaded();
		expect(cardNames()).toEqual(['SU Robotics Club']);
	});
});
