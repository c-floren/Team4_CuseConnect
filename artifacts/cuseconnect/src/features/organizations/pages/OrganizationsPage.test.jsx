import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../../../App.jsx';
import { demoClubs } from '../data/demoClubs.js';

// Stands in for the real Supabase client so live mode never touches the network.
// Each test sets what the query resolves to.
const query = vi.hoisted(() => ({ result: { data: [], error: null } }));

vi.mock('../../../lib/supabaseClient.js', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        order: () => Promise.resolve(query.result),
      }),
    }),
  },
}));

function renderHome() {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  );
}

const banner = () => screen.queryByRole('note');

afterEach(() => vi.unstubAllEnvs());

describe('organizations page in demo mode', () => {
  beforeEach(() => vi.stubEnv('VITE_DEMO_MODE', 'true'));

  it('shows a card for every demo club', async () => {
    renderHome();

    const cards = await screen.findAllByRole('article');
    expect(cards).toHaveLength(demoClubs.length);
    expect(screen.getByRole('heading', { name: 'SU Robotics Club' })).toBeInTheDocument();
    expect(screen.queryByText(/recommendation goes here|lorem ipsum/i)).toBeNull();
  });

  it('marks the page with the demo banner', async () => {
    renderHome();

    expect(banner()).toHaveTextContent(
      'Demo mode: clubs shown are sample data, not an official SU list.',
    );
    await screen.findAllByRole('article');
  });
});

describe('organizations page with live data', () => {
  beforeEach(() => vi.stubEnv('VITE_DEMO_MODE', 'false'));

  it('shows clubs from Supabase and no demo banner', async () => {
    query.result = {
      data: [{ id: 42, name: 'Live Test Club', description: 'From the database.' }],
      error: null,
    };
    renderHome();

    expect(await screen.findByRole('heading', { name: 'Live Test Club' })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(1);
    expect(banner()).toBeNull();
  });

  it('shows a loading message while clubs are on their way', async () => {
    renderHome();

    expect(screen.getByRole('status')).toHaveTextContent('Loading clubs');
    await screen.findByRole('list');
  });

  it('shows an error message when the request fails', async () => {
    query.result = { data: null, error: new Error('network down') };
    renderHome();

    expect(await screen.findByRole('alert')).toHaveTextContent("couldn't load clubs");
    expect(screen.queryByRole('article')).toBeNull();
  });
});
