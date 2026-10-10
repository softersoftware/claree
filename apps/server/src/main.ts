import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { githubAuthentication } from '@claree/github-adapters';
import { apiServer } from './api-server';

/** The application's files, built: served at every address but the server's own. */
const web = process.env.CLAREE_WEB ?? '../web/dist';

const app = new Hono()
  .route(
    '/',
    apiServer(
      {
        authentication: githubAuthentication({
          clientId: process.env.GITHUB_APP_CLIENT_ID ?? '',
          clientSecret: process.env.GITHUB_APP_CLIENT_SECRET ?? '',
          appSlug: process.env.GITHUB_APP_SLUG ?? '',
        }),
      },
      { secure: process.env.NODE_ENV === 'production' },
    ),
  )
  .use('*', serveStatic({ root: web }))
  .get(
    '*',
    (c, next) => (c.req.path.startsWith('/api/') ? c.notFound() : next()),
    serveStatic({ path: `${web}/index.html` }),
  );

serve({ fetch: app.fetch, port: Number(process.env.PORT ?? 3001) });
