"use client";
import { CommunityModal } from "@/components/modals/community-modal";
import { DeleteCommunityModal } from "@/components/modals/delete-community-modal";
import { EditProfileModal } from "@/components/modals/edit-profile-modal";
import { KickCommunityModal } from "@/components/modals/kick-community-modal";
import { LeaveCommunityModal } from "@/components/modals/leave-community-modal";
import { MakingCommunityAdminModal } from "@/components/modals/making-community-admin-modal";
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
      <CommunityModal />
      <KickCommunityModal />
      <MakingCommunityAdminModal />
      <LeaveCommunityModal />
      <DeleteCommunityModal />
    </>
  );
};

export default ModalProvider;
