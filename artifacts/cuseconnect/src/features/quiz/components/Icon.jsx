/**
 * Inline SVG icon set for the quiz options.
 *
 * Hand-drawn from simple primitives rather than pulled from an icon package —
 * 16 small glyphs isn't worth a dependency. Strokes use currentColor, so the
 * color is set in CSS by whatever wraps the icon.
 */
const GLYPHS = {
  // Q1 — interests
  palette: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="8.5" cy="10" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="7.8" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="10" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  heart: (
    <path d="M12 21s-8-5-8-10.5A3.5 3.5 0 0 1 12 8a3.5 3.5 0 0 1 8 2.5C20 16 12 21 12 21Z" />
  ),
  activity: <polyline points="3 12 8 12 10.5 6.5 13.5 17.5 16 12 21 12" />,
  code: (
    <>
      <polyline points="9 8 5 12 9 16" />
      <polyline points="15 8 19 12 15 16" />
      <line x1="13.2" y1="6" x2="10.8" y2="18" />
    </>
  ),
  trendingUp: (
    <>
      <polyline points="4 16.5 9.5 11 13 14.5 20 7.5" />
      <polyline points="15 7.5 20 7.5 20 12.5" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <ellipse cx="12" cy="12" rx="4" ry="9" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0" />
      <line x1="12" y1="18" x2="12" y2="21" />
    </>
  ),
  mountain: <path d="M3 19h18L14.5 7.5 11 13.5 8.75 10 3 19Z" />,

  // Q2 — working style
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5 13 13l-4.5 2.5L11 11Z" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="9" r="3" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <path d="M16 6.5a3 3 0 0 1 0 5.8" />
      <path d="M17.5 14.2a5.5 5.5 0 0 1 3 4.8" />
    </>
  ),
  sliders: (
    <>
      <line x1="4" y1="8" x2="20" y2="8" />
      <line x1="4" y1="16" x2="20" y2="16" />
      <circle cx="9" cy="8" r="2.2" />
      <circle cx="15" cy="16" r="2.2" />
    </>
  ),
  doorIn: (
    <>
      <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" />
      <polyline points="9 8 13 12 9 16" />
      <line x1="13" y1="12" x2="3.5" y2="12" />
    </>
  ),

  // Q3 — commitment
  sprout: (
    <>
      <path d="M12 21v-8" />
      <path d="M12 13c0-3.3-2.7-6-6-6 0 3.3 2.7 6 6 6Z" />
      <path d="M12 13c0-3.9 3.1-7 7-7 0 3.9-3.1 7-7 7Z" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <line x1="3.5" y1="9.5" x2="20.5" y2="9.5" />
      <line x1="8.5" y1="3" x2="8.5" y2="6.5" />
      <line x1="15.5" y1="3" x2="15.5" y2="6.5" />
    </>
  ),
  flame: (
    <path d="M12 2.5s5.5 4.5 5.5 9.5a5.5 5.5 0 0 1-11 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-3.5 1.5-6 1.5-8Z" />
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
    </>
  ),
};

export default function Icon({ name }) {
  const glyph = GLYPHS[name];
  if (!glyph) return null;

  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {glyph}
    </svg>
  );
}
