import { Follower, Following, Tweet, User } from "@prisma/client";

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
  followers: Follower[];
  followings: Following[]
};

export type NavigationType =
  | "TWEETS"
  | "REPLIES"
  | "LIKES"
  | "MEDIA"
  | "FOR YOU"
  | "FOLLOWING"
  | "PEOPLE"
  | "TWEET_REPLIES"
