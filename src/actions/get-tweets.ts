// "use server";

// import db from "@/lib/db";
// import { QueryType } from "@/types";

// export const getTweets = async ({
//   cursor,
//   type,
//   limit,
//   q,
//   tweetId,
//   userId,
// }: {
//   cursor?: string;
//   type?: QueryType;
//   limit?: number;
//   tweetId?: string;
//   userId?: string;
//   q?: string;
// } = {}) => {
//   const take = limit || 10;
//   const tweets = await db.tweet.findMany({
//     where: {},
//     ...(cursor
//       ? {
//           skip: 1,
//           cursor: {
//             id: cursor,
//           },
//         }
//       : {}),
//   });

//   let nextCursor = null;

//   if (tweets.length === take) {
//     nextCursor = tweets[take - 1].id;
//   }

//   return { items: tweets, nextCursor };
// };
