import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App.jsx';

function renderApp(route = '/') {
  return {
    user: userEvent.setup(),
    ...render(
      <MemoryRouter initialEntries={[route]}>
        <App />
      </MemoryRouter>,
    ),
  };
}

// The home page loads clubs asynchronously; wait for them so the update lands
// inside the test.
const clubsLoaded = () => screen.findAllByRole('article');

const nav = () => screen.getByRole('navigation', { name: 'Main' });
const navLink = (name) => screen.getByRole('link', { name });

describe('app navigation', () => {
  // Demo mode keeps these tests off the network; data loading has its own
  // tests in OrganizationsPage.test.jsx.
  beforeEach(() => vi.stubEnv('VITE_DEMO_MODE', 'true'));
  afterEach(() => vi.unstubAllEnvs());

  it('shows the organizations page at /', async () => {
    renderApp('/');

    expect(screen.getByRole('heading', { level: 1, name: 'Explore Clubs' })).toBeInTheDocument();
    expect(await clubsLoaded()).toHaveLength(10);
    expect(navLink('Home')).toHaveAttribute('aria-current', 'page');
  });

  it('opens the quiz from the sidebar', async () => {
    const { user } = renderApp('/');
    await clubsLoaded();

    await user.click(navLink('Quiz'));

    expect(
      screen.getByRole('heading', { level: 1, name: 'What pulls you in?' }),
    ).toBeInTheDocument();
    expect(navLink('Quiz')).toHaveAttribute('aria-current', 'page');
    expect(navLink('Home')).not.toHaveAttribute('aria-current');
  });

  it('keeps quiz answers after leaving the quiz and coming back', async () => {
    const { user } = renderApp('/quiz/1');

    await user.click(screen.getByRole('checkbox', { name: /Arts & design/ }));
    await user.click(navLink('Home'));
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    await clubsLoaded();

    await user.click(navLink('Quiz'));

    expect(screen.getByRole('checkbox', { name: /Arts & design/ })).toBeChecked();
  });

  it('shows unbuilt pages as text, not links', async () => {
    renderApp('/');
    await clubsLoaded();

    for (const label of ['Events', 'Saved Orgs', 'Forms', 'Friends']) {
      expect(screen.queryByRole('link', { name: new RegExp(label) })).toBeNull();
      expect(nav()).toHaveTextContent(label);
    }
  });

  it('sends unknown URLs home', async () => {
    renderApp('/nowhere');
    await clubsLoaded();

    expect(navLink('Home')).toHaveAttribute('aria-current', 'page');
  });
});
