import { Community, Follow, Member, Tweet, User } from "@prisma/client";

export type FullTweetType = Tweet & {
  retweets: Tweet[];
  likes: User[];
  user: User;
  tweet?:
    | (Tweet & {
        user: User;
        likes: User[];
        retweets: Tweet[];
      })
    | null;
};

export type FullUserType = User & {
  followers: Follow[];
  followings: Follow[];
};

export type FullCommunityType = Community & {
  members: (Member & {
    user: User;
  })[];
  requestedUsers: User[];
};

export type QueryType =
  | "TWEETS"
  | "REPLIES"
  | "LIKES"
  | "MEDIA"
  | "FOR YOU"
  | "FOLLOWINGS"
  | "FOLLOWERS"
  | "FOLLOWING"
  | "WHO_TO_FOLLOW"
  | "PEOPLE"
  | "COMMUNITY_MODERATORS"
  | "COMMUNITY_MEMBERS"
  | "TWEET_REPLIES"
  | "ABOUT"
  | "REQUESTS"
  | "COMMUNITIES_TWEETS";
