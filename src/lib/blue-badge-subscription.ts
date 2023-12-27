import { UserWithBlueBadge } from "@/types";

const DAY_IN_MS = 86_400_000;

export const checkBlueBadgeSubscription = (user: UserWithBlueBadge) => {
  const { blueBadgeSubscription } = user;

  if (!blueBadgeSubscription) {
    return false;
  }

  const isValid =
    blueBadgeSubscription.stripePriceId &&
    blueBadgeSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS >
      Date.now();

  return !!isValid;
};
