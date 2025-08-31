import { initEdgeStore } from '@edgestore/server';
import { createEdgeStoreNextHandler } from '@edgestore/server/adapters/next/app';
import {z} from "zod";

const es = initEdgeStore.create();

/**
 * This is the main router for the Edge Store buckets.
 */
const edgeStoreRouter = es.router({
    publicFiles: es
        .fileBucket()
        .beforeDelete(({ ctx, fileInfo }) => {
            console.log('beforeDelete', ctx, fileInfo);
            return true;
        })
        .input(
            z.object({
                type: z.union([
                    z.literal("post"),
                    z.string().regex(
                        /^profile\/[^/]+$/,
                        "type must be `profile/{id}` (e.g. `profile/1234abcd`)"
                    ),
                ]),
            })
        )
        .path(({ input }) => [{ type: input.type }]),

});

const handler = createEdgeStoreNextHandler({
    router: edgeStoreRouter,
});

export { handler as GET, handler as POST };

/**
 * This type is used to create the type-safe client for the frontend.
 */
export type EdgeStoreRouter = typeof edgeStoreRouter;