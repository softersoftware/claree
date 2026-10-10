import { createHashHistory, createRouter } from '@tanstack/react-router';
import { rootRoute } from '@/layout';
import { arrivalRoute } from '@/pages/arrival';
import { domainRoute, domainsRoute } from '@/pages/domains';
import { featureRoute, featuresRoute, storyRoute } from '@/pages/features';
import { businessRoute, overviewRoute, projectRoute } from '@/pages/project';
import { versionsRoute } from '@/pages/versions';
import { workshopRoute, workshopsRoute } from '@/pages/workshops';

export const router = createRouter({
  routeTree: rootRoute.addChildren([
    arrivalRoute,
    projectRoute.addChildren([
      overviewRoute,
      businessRoute,
      workshopsRoute,
      workshopRoute,
      domainsRoute,
      domainRoute,
      featuresRoute,
      featureRoute,
      storyRoute,
      versionsRoute,
    ]),
  ]),
  /** A sketch is a static site, which serves one page: its address stays after the `#`. */
  history: createHashHistory(),
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
