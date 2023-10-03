import { appRouter } from '@/server/api/root';
import { createTRPCContext } from '@/server/api/trpc';
import { createOpenApiFetchHandler } from '@/server/api/trpcOpenApiFetchAdapter';

const handler = (req: Request) => {
  return createOpenApiFetchHandler({
    req,
    endpoint: '/api/rest',
    router: appRouter,
    createContext: createTRPCContext,
  });
};

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
