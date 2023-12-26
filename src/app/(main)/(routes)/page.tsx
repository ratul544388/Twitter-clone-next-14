import getCurrentUser from "@/actions/get-current-user";
import HomePageClient from "../_components/home-page-client";
export const dynamic = "force-dynamic";

export default async function Home() {
  const currentUser = await getCurrentUser();

  return <HomePageClient currentUser={currentUser} />;
}
