// import { getTweets } from "@/actions/get-tweets";
// import { FullTweetType, QueryType } from "@/types";
// import { Community, User } from "@prisma/client";
// import { useInfiniteQuery } from "@tanstack/react-query";
// import { useEffect } from "react";
// import { useInView } from "react-intersection-observer";

// export const useInfinityTweet = ({
//   initialTweets,
//   currentUser,
//   limit,
//   type,
//   community,
//   tweetId,
//   userId,
//   q,
// }: {
//   initialTweets?: FullTweetType;
//   currentUser: User;
//   type: QueryType;
//   community?: Community;
//   tweetId?: string;
//   userId?: string;
//   limit?: number;
//   q?: string;
// }) => {
//   const { inView, ref } = useInView();
//   const { data, status, fetchNextPage, hasNextPage, refetch } =
//     useInfiniteQuery({
//       queryKey: ["type"],
//       //@ts-ignore
//       queryFn: async ({ pageParam = undefined }) => {
//         const response = await getTweets({
//           cursor: pageParam,
//           type,
//           limit,
//           q,
//           tweetId,
//           userId,
//         });
//         return response;
//       },
//       getNextPageParam: (lastPage) => lastPage?.nextCursor,
//       ...(initialTweets
//         ? {
//             initialData: () => {
//               return {
//                 pages: [{ items: initialTweets, nextCursor: null }],
//                 pageParams: [undefined],
//               };
//             },
//           }
//         : {
//             initialPageParam: undefined,
//           }),
//     });

//   useEffect(() => {
//     if (inView && hasNextPage) {
//       fetchNextPage();
//     }
//   }, [inView, hasNextPage, fetchNextPage]);

//   const tweets = data?.pages.flatMap((page) => page.items);

//   return {
//     tweets,
//     status,
//     hasNextPage,
//     ref,
//   };
// };
