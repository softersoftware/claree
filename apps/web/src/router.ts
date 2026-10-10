import { createRouter } from '@tanstack/react-router';
import { history } from '@/adapters';
import { rootRoute } from '@/layout';
import { projectRoute } from '@/pages/project';
import { projectsRoute } from '@/pages/projects';
import { callbackRoute, signInRoute } from '@/pages/sign-in';

export const router = createRouter({
  routeTree: rootRoute.addChildren([signInRoute, callbackRoute, projectsRoute, projectRoute]),
  history,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
