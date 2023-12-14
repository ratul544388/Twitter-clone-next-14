import getCurrentUser from "@/actions/get-current-user";
import { SearchClient } from "./search-client";
import { redirect } from "next/navigation";

const ExplorePage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const currentUser = await getCurrentUser();
  const q = searchParams.q as string;

  if (!q) {
    redirect("/explore");
  }

  return <SearchClient currentUser={currentUser} />;
};

export default ExplorePage;
