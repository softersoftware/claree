import { hc } from 'hono/client';
import type { ApiServer } from '@claree/server';
import { server } from '@/adapters';

export const { api } = hc<ApiServer>(window.location.origin, { fetch: server });
