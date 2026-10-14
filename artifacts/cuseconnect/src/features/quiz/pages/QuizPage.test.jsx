import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import App from '../../../App.jsx';

/**
 * Renders the real routes rather than QuizPage on its own, so "Continue"
 * actually moves between steps and the Results screen is reachable.
 */
function renderQuiz(route = '/quiz/1') {
  return {
    user: userEvent.setup(),
    ...render(
      <MemoryRouter initialEntries={[route]}>
        <App />
      </MemoryRouter>,
    ),
  };
}

const prompt = (name) => screen.getByRole('heading', { level: 1, name });

describe('answering the quiz', () => {
  it('renders question 1 as checkboxes and question 2 as radios', async () => {
    const { user } = renderQuiz();

    expect(prompt('What pulls you in?')).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox')).toHaveLength(8);

    await user.click(screen.getByRole('checkbox', { name: /Arts & design/ }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    expect(prompt('How do you like to show up?')).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(4);
  });

  it('keeps every checkbox selection on a multi-select question', async () => {
    const { user } = renderQuiz();

    const arts = screen.getByRole('checkbox', { name: /Arts & design/ });
    const tech = screen.getByRole('checkbox', { name: /Tech & making/ });

    await user.click(arts);
    await user.click(tech);

    expect(arts).toBeChecked();
    expect(tech).toBeChecked();
  });

  it('replaces the previous answer on a radio question', async () => {
    const { user } = renderQuiz('/quiz/2');

    const outFront = screen.getByRole('radio', { name: /Out front/ });
    const smallTeam = screen.getByRole('radio', { name: /On a small team/ });

    await user.click(outFront);
    expect(outFront).toBeChecked();

    await user.click(smallTeam);
    expect(smallTeam).toBeChecked();
    expect(outFront).not.toBeChecked();
  });

  it('keeps earlier answers when going Back', async () => {
    const { user } = renderQuiz();

    await user.click(screen.getByRole('checkbox', { name: /Arts & design/ }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.click(screen.getByRole('button', { name: 'Back' }));

    expect(screen.getByRole('checkbox', { name: /Arts & design/ })).toBeChecked();
  });

  it('reaches the Results screen after all three questions', async () => {
    const { user } = renderQuiz();

    await user.click(screen.getByRole('checkbox', { name: /Arts & design/ }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    await user.click(screen.getByRole('radio', { name: /Out front/ }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    await user.click(screen.getByRole('radio', { name: /Weekly meetings/ }));
    await user.click(screen.getByRole('button', { name: 'See my matches' }));

    expect(prompt('Your matches are coming soon')).toBeInTheDocument();
  });
});

describe('leaving a question blank', () => {
  it('does not advance and prompts for an answer', async () => {
    const { user } = renderQuiz();

    await user.click(screen.getByRole('button', { name: 'Continue' }));

    expect(prompt('What pulls you in?')).toBeInTheDocument();
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Pick at least one option to continue.',
    );
  });

  it('uses the single-choice wording on a radio question', async () => {
    const { user } = renderQuiz('/quiz/2');

    await user.click(screen.getByRole('button', { name: 'Continue' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Choose an option to continue.',
    );
  });

  it('clears the prompt once an option is picked', async () => {
    const { user } = renderQuiz();

    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(await screen.findByRole('alert')).toBeInTheDocument();

    await user.click(screen.getByRole('checkbox', { name: /Arts & design/ }));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});

describe('invalid step in the URL', () => {
  it.each(['/quiz/99', '/quiz/abc', '/quiz/0'])(
    'sends %s back to question 1',
    (route) => {
      renderQuiz(route);

      expect(prompt('What pulls you in?')).toBeInTheDocument();
    },
  );
});
