import getCurrentUser from "@/actions/get-current-user";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const handleAuth = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("Unauthenticated");
  return { userId: currentUser.id };
};

export const ourFileRouter = {
  singlePhoto: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  multiMedia: f({
    image: { maxFileSize: "8MB", maxFileCount: 5 },
    video: { maxFileSize: "32MB", maxFileCount: 1 },
  })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
