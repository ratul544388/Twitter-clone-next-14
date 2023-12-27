import getCurrentUser from "@/actions/get-current-user";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import { BlueBadgeClient } from "./blue-badge-client";

const BlueBadgePage = async () => {
  const currentUser = await getCurrentUser();

  const user = await db.user.findUnique({
    where: {
      userId: currentUser.userId,
    },
    include: {
      blueBadgeSubscription: true,
    },
  });

  if (!user) {
    redirect("/");
  }

  return <BlueBadgeClient user={user} />;
};

export default BlueBadgePage;
