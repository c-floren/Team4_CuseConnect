/**
 * Mock quiz content for the 3-question matching quiz.
 *
 * Everything that differs between the three screens lives here as data — the
 * control type, the column layout, the copy — so QuizPage stays generic instead
 * of being three near-identical components.
 *
 * `type`   'multi'  -> checkboxes, answer is an array of option ids
 *          'single' -> radios, answer is a single option id
 * `layout` 'grid'   -> two columns
 *          'list'   -> one column
 */
export const quizQuestions = [
  {
    id: 'interests',
    prompt: 'What pulls you in?',
    helper: 'Select all that apply',
    type: 'multi',
    layout: 'grid',
    options: [
      {
        id: 'arts',
        icon: 'palette',
        label: 'Arts & design',
        sublabel: 'Studio time, galleries, making things',
      },
      {
        id: 'service',
        icon: 'heart',
        label: 'Service & volunteering',
        sublabel: 'Give time back around Syracuse',
      },
      {
        id: 'sports',
        icon: 'activity',
        label: 'Club & intramural sports',
        sublabel: 'Compete, or just stay moving',
      },
      {
        id: 'tech',
        icon: 'code',
        label: 'Tech & making',
        sublabel: 'Hackathons, robotics, side projects',
      },
      {
        id: 'business',
        icon: 'trendingUp',
        label: 'Business & finance',
        sublabel: 'Case comps, startups, investing',
      },
      {
        id: 'culture',
        icon: 'globe',
        label: 'Culture & identity',
        sublabel: 'Community, heritage, belonging',
      },
      {
        id: 'media',
        icon: 'mic',
        label: 'Media & writing',
        sublabel: 'Radio, journalism, film, podcasts',
      },
      {
        id: 'outdoors',
        icon: 'mountain',
        label: 'Outdoors & recreation',
        sublabel: 'Hiking, skiing, Adirondack trips',
      },
    ],
  },
  {
    id: 'workingStyle',
    prompt: 'How do you like to show up?',
    helper: 'Choose one',
    type: 'single',
    layout: 'list',
    options: [
      {
        id: 'lead',
        icon: 'compass',
        label: 'Out front',
        sublabel: 'Running meetings, organizing the group',
      },
      {
        id: 'small-team',
        icon: 'users',
        label: 'On a small team',
        sublabel: 'A handful of people building something together',
      },
      {
        id: 'behind-scenes',
        icon: 'sliders',
        label: 'Behind the scenes',
        sublabel: 'Steady work that keeps things running',
      },
      {
        id: 'drop-in',
        icon: 'doorIn',
        label: 'Dropping in',
        sublabel: 'Show up when it works, no pressure',
      },
    ],
  },
  {
    id: 'commitment',
    prompt: 'Time & commitment',
    helper: 'Choose one',
    type: 'single',
    layout: 'list',
    options: [
      {
        id: 'light',
        icon: 'sprout',
        label: 'An hour or two a month',
        sublabel: 'Keeping it light this semester',
      },
      {
        id: 'weekly',
        icon: 'calendar',
        label: 'Weekly meetings',
        sublabel: 'A regular spot on my schedule',
      },
      {
        id: 'heavy',
        icon: 'flame',
        label: 'Several times a week',
        sublabel: 'I want this to be a big part of my year',
      },
      {
        id: 'seasonal',
        icon: 'target',
        label: 'Bursts around events',
        sublabel: 'Quiet stretches, then all-in for a project',
      },
    ],
  },
];
