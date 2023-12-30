import getCurrentUser from "@/actions/get-current-user";
import { BottomNavbar } from "@/components/bottom-navbar";
import Followbar from "@/components/followbar/followbar";
import Sidebar from "@/components/sidebar/sidebar";
import ModalProvider from "@/providers/modal-provider";
import { QueryProvider } from "@/providers/query-provider";
import { ReactNode } from "react";

export default async function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return null;
  }

  return (
    <div className="grid grid-cols-20 max-w-screen-2xl mx-auto h-full">
      <QueryProvider>
        <ModalProvider currentUser={currentUser} />
        <Sidebar
          className="hidden xs:block col-span-4 sm:col-span-3 xl:col-span-4"
          currentUser={currentUser}
        />
        <main className="col-span-20 pb-20 xs:col-span-16 md:col-span-13 lg:col-span-9">
          {children}
        </main>
        <div className="hidden border-l-[1.5px] md:flex md:col-span-4 lg:col-span-8 xl:col-span-7 h-full">
          <Followbar currentUser={currentUser} />
        </div>
        <BottomNavbar />
      </QueryProvider>
    </div>
  );
}
