"use client";
import { EditProfileModal } from "@/components/modals/edit-profile-modal";
import { QuoteTweetModal } from "@/components/modals/quote-tweet-modal";
import { ReplyModal } from "@/components/modals/reply-modal";
import { TweetModal } from "@/components/modals/tweet-modal";
import { User } from "@prisma/client";
import { useEffect, useState } from "react";

const ModalProvider = ({ currentUser }: { currentUser: User | null }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, [mounted]);

  if (!mounted || !currentUser) {
    return null;
  }

  return (
    <>
      <TweetModal currentUser={currentUser} />
      <EditProfileModal currentUser={currentUser} />
      <QuoteTweetModal currentUser={currentUser} />
      <ReplyModal currentUser={currentUser} />
    </>
  );
};

export default ModalProvider;
