// Adds the DOM matchers used across the suite (toBeInTheDocument, toBeChecked,
// and so on) and clears the rendered tree between tests.
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(cleanup);
