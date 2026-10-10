import { createRouter } from '@/adapters';
import { Failed, Layout, userLoader } from '@/layout';
import { Project, projectLoader } from '@/pages/project';
import { Projects, projectsLoader } from '@/pages/projects';
import { callbackLoader, SignIn, signInLoader } from '@/pages/sign-in';

export const router = createRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <Failed />,
    HydrateFallback: () => null,
    loader: userLoader,
    /** Who is signed in can change on any page: signing in, or out. */
    shouldRevalidate: () => true,
    children: [
      { index: true, element: <SignIn />, loader: signInLoader },
      { path: 'sign-in/callback', element: null, loader: callbackLoader },
      { path: 'projects', element: <Projects />, loader: projectsLoader },
      { path: 'projects/:owner/:repository', element: <Project />, loader: projectLoader },
    ],
  },
]);
