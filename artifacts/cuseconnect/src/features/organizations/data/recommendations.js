/**
 * Placeholder recommendations, carried over from the static Index.html mockup.
 * Real matches will come from the quiz answers and the Supabase clubs table in
 * a later story.
 */
// Only covers 1–10, which is all this placeholder list needs.
const ordinal = (n) => ['1st', '2nd', '3rd'][n - 1] ?? `${n}th`;

const blurbs = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Sed do eiusmod tempor incididunt ut labore et dolore.',
  'Ut enim ad minim veniam, quis nostrud exercitation.',
  'Duis aute irure dolor in reprehenderit in voluptate.',
  'Excepteur sint occaecat cupidatat non proident, sunt.',
];

export const recommendations = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  rank: i + 1,
  name: `Your ${ordinal(i + 1)} recommendation goes here`,
  blurb: blurbs[i % blurbs.length],
}));
