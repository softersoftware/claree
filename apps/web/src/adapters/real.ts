import { createBrowserRouter } from 'react-router';

/** The server the application is served from (ADR 0016). */
export const server: typeof fetch = (input, init) => fetch(input, init);

export const createRouter = createBrowserRouter;
