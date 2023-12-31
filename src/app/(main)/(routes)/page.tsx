import getCurrentUser from "@/actions/get-current-user";
import HomePageClient from "../_components/home-page-client";
import db from "@/lib/db";
export const dynamic = "force-dynamic";

export default async function Home() {
  const currentUser = await getCurrentUser();

  const hasPeopleToFollow = await db.user.findFirst({
    where: {
      followers: {
        none: {
          followerId: currentUser.id,
        },
      },
      id: {
        not: currentUser.id,
      },
    },
  });

  return (
    <HomePageClient
      currentUser={currentUser}
      hasPeopleToFollow={!!hasPeopleToFollow}
    />
  );
}
