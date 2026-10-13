import { createRouter } from '@tanstack/react-router';
import { history } from '@/adapters';
import { rootRoute } from '@/layout';
import { brandingRoute } from '@/pages/branding';
import { domainRoute, domainsRoute } from '@/pages/domains';
import { featureRoute, featuresRoute, storyRoute } from '@/pages/features';
import { milestonesRoute } from '@/pages/milestones';
import { overviewRoute, projectRoute } from '@/pages/project';
import { projectsRoute } from '@/pages/projects';
import { prototypesRoute } from '@/pages/prototypes';
import { callbackRoute, signInRoute } from '@/pages/sign-in';
import { workshopsRoute } from '@/pages/workshops';

export const router = createRouter({
  routeTree: rootRoute.addChildren([
    signInRoute,
    callbackRoute,
    projectsRoute,
    projectRoute.addChildren([
      overviewRoute,
      workshopsRoute,
      domainsRoute,
      domainRoute,
      prototypesRoute,
      featuresRoute,
      featureRoute,
      storyRoute,
      milestonesRoute,
      brandingRoute,
    ]),
  ]),
  history,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
