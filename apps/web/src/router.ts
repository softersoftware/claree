import { createRouter } from '@tanstack/react-router';
import { history } from '@/adapters';
import { rootRoute } from '@/layout';
import { brandingRoute } from '@/pages/branding';
import { domainRoute, domainsRoute } from '@/pages/domains';
import { feedbackRoute } from '@/pages/feedback';
import { overviewRoute, projectRoute } from '@/pages/project';
import { projectsRoute } from '@/pages/projects';
import { prototypesRoute } from '@/pages/prototypes';
import { callbackRoute, signInRoute } from '@/pages/sign-in';
import { storyMapRoute, storyRoute } from '@/pages/stories';
import { deploymentRoute, planningRoute, underWayRoute } from '@/pages/versions';
import { workshopRoute, workshopsRoute } from '@/pages/workshops';

export const router = createRouter({
  routeTree: rootRoute.addChildren([
    signInRoute,
    callbackRoute,
    projectsRoute,
    projectRoute.addChildren([
      overviewRoute,
      brandingRoute,
      workshopsRoute,
      workshopRoute,
      domainsRoute,
      domainRoute,
      prototypesRoute,
      storyMapRoute,
      storyRoute,
      planningRoute,
      underWayRoute,
      deploymentRoute,
      feedbackRoute,
    ]),
  ]),
  history,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
