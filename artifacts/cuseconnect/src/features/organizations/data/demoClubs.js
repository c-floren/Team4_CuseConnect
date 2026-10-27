/**
 * DEMO DATA ONLY — sample clubs for demo mode, not an official SU list.
 * Shown only when VITE_DEMO_MODE=true; real clubs come from the Supabase
 * `clubs` table. Same shape as that table, so pages can't tell the difference.
 *
 * Copied from the seed in supabase/setup.sql. `category` matches an option id
 * from quiz question 1 (src/features/quiz/data/quizQuestions.js).
 */
export const demoClubs = [
  {
    id: 1,
    name: 'SU Robotics Club',
    description:
      'Students design, build, and compete with robots. No experience needed — just curiosity and a willingness to get hands-on.',
    category: 'tech',
    tags: ['robotics', 'engineering', 'competition'],
    meets: 'Thursdays, 6 PM · Link Hall',
  },
  {
    id: 2,
    name: 'Orange Filmworks',
    description:
      'A student-run production team that writes, shoots, and edits short films together each semester.',
    category: 'media',
    tags: ['film', 'video', 'storytelling'],
    meets: 'Tuesdays, 7 PM · Newhouse 3',
  },
  {
    id: 3,
    name: 'Cuse Hacks',
    description:
      "Syracuse's student hackathon community. Build projects, learn new tools, and meet other builders on campus.",
    category: 'tech',
    tags: ['hackathons', 'coding', 'projects'],
    meets: 'Mondays, 8 PM · CST Building',
  },
  {
    id: 4,
    name: 'SU Outing Club',
    description:
      'Weekend hikes, camping trips, and climbing outings around Central New York for students of any experience level.',
    category: 'outdoors',
    tags: ['hiking', 'camping', 'climbing'],
    meets: 'Weekends · Meet at Schine',
  },
  {
    id: 5,
    name: 'Best Buddies Syracuse',
    description:
      'Builds one-to-one friendships between SU students and members of the local community with intellectual disabilities.',
    category: 'service',
    tags: ['volunteering', 'community', 'friendship'],
    meets: 'Wednesdays, 5 PM · Schine 304A',
  },
  {
    id: 6,
    name: 'WAER Sports Broadcasting',
    description:
      'Student broadcasters calling live Syracuse sports, producing shows, and building a demo reel for the industry.',
    category: 'media',
    tags: ['broadcasting', 'sports', 'radio'],
    meets: 'Game days · Newhouse Studios',
  },
  {
    id: 7,
    name: 'Orange Investment Group',
    description:
      'Students research stocks, pitch ideas, and manage a mock portfolio together. Great prep for finance internships.',
    category: 'business',
    tags: ['investing', 'finance', 'case-competitions'],
    meets: 'Wednesdays, 7 PM · Whitman School',
  },
  {
    id: 8,
    name: 'Caribbean Student Association',
    description:
      'A home away from home celebrating Caribbean culture through food, music, dance, and the annual cultural showcase.',
    category: 'culture',
    tags: ['heritage', 'community', 'events'],
    meets: 'Fridays, 6 PM · Schine 228',
  },
  {
    id: 9,
    name: 'Clay Collective',
    description:
      'Open studio nights for wheel throwing and hand building. Beginners welcome — materials provided.',
    category: 'arts',
    tags: ['ceramics', 'studio', 'making'],
    meets: 'Tuesdays, 6 PM · Comstock Art Facility',
  },
  {
    id: 10,
    name: 'Club Ultimate Frisbee',
    description:
      'Competitive and casual ultimate frisbee. Practice on the Quad, travel to tournaments, or just come throw.',
    category: 'sports',
    tags: ['ultimate', 'frisbee', 'intramural'],
    meets: 'Mon & Thu, 5 PM · Skytop Fields',
  },
];
