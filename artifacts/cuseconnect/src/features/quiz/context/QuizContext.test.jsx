import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { QuizProvider, useQuiz } from './QuizContext.jsx';

/**
 * Answer-state rules, tested directly against the hook. The same rules are
 * exercised through the UI in QuizPage.test.jsx; these cover the edges that are
 * awkward to reach by clicking, like the empty-array case.
 */
function setup() {
  return renderHook(() => useQuiz(), {
    wrapper: ({ children }) => <QuizProvider>{children}</QuizProvider>,
  });
}

describe('multi questions (checkboxes)', () => {
  it('keeps every selection', () => {
    const { result } = setup();

    act(() => result.current.toggleAnswer('interests', 'arts', 'multi'));
    act(() => result.current.toggleAnswer('interests', 'tech', 'multi'));

    expect(result.current.getAnswer('interests', 'multi')).toEqual([
      'arts',
      'tech',
    ]);
  });

  it('removes an option when it is toggled a second time', () => {
    const { result } = setup();

    act(() => result.current.toggleAnswer('interests', 'arts', 'multi'));
    act(() => result.current.toggleAnswer('interests', 'tech', 'multi'));
    act(() => result.current.toggleAnswer('interests', 'arts', 'multi'));

    expect(result.current.getAnswer('interests', 'multi')).toEqual(['tech']);
  });

  it('defaults to an empty array before anything is picked', () => {
    const { result } = setup();

    expect(result.current.getAnswer('interests', 'multi')).toEqual([]);
  });
});

describe('single questions (radios)', () => {
  it('replaces the previous answer instead of collecting both', () => {
    const { result } = setup();

    act(() => result.current.toggleAnswer('commitment', 'light', 'single'));
    act(() => result.current.toggleAnswer('commitment', 'weekly', 'single'));

    expect(result.current.getAnswer('commitment', 'single')).toBe('weekly');
  });

  it('defaults to null before anything is picked', () => {
    const { result } = setup();

    expect(result.current.getAnswer('commitment', 'single')).toBeNull();
  });
});

describe('isAnswered', () => {
  it('is false for an untouched question', () => {
    const { result } = setup();

    expect(result.current.isAnswered('interests')).toBe(false);
  });

  it('is false once the last checkbox is unticked, not just before the first', () => {
    const { result } = setup();

    act(() => result.current.toggleAnswer('interests', 'arts', 'multi'));
    act(() => result.current.toggleAnswer('interests', 'arts', 'multi'));

    expect(result.current.getAnswer('interests', 'multi')).toEqual([]);
    expect(result.current.isAnswered('interests')).toBe(false);
  });

  it('is true once an option is selected', () => {
    const { result } = setup();

    act(() => result.current.toggleAnswer('commitment', 'weekly', 'single'));

    expect(result.current.isAnswered('commitment')).toBe(true);
  });
});

describe('resetQuiz', () => {
  it('clears answers from every question', () => {
    const { result } = setup();

    act(() => result.current.toggleAnswer('interests', 'arts', 'multi'));
    act(() => result.current.toggleAnswer('commitment', 'weekly', 'single'));
    act(() => result.current.resetQuiz());

    expect(result.current.answers).toEqual({});
    expect(result.current.isAnswered('interests')).toBe(false);
    expect(result.current.isAnswered('commitment')).toBe(false);
  });
});
