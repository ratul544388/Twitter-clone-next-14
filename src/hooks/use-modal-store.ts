import { FullTweetType } from "@/types";
import { Community, Member, Tweet, User } from "@prisma/client";
import { create } from "zustand";

export type ModalType =
  | "deleteTweetModal"
  | "editProfileModal"
  | "registerModal"
  | "tweetModal"
  | "quoteTweetModal"
  | "replyModal"
  | "communityModal"
  | "deleteCommunityModal"
  | "leaveCommunityModal"
  | "logoutModal"
  | "cancelCommunityRequestModal"
  | "makingCommunityAdminModal"
  | "kickCommunityModal"
  | "mediaViewerModal"
  | "adminLeavingCommunityModal";
interface ModalData {
  user?: User;
  tweet?: FullTweetType;
  quote?: Tweet & { user: User } | null;
  communityId?: string | null;
  community?: Community;
  member?: Member & {
    user: User;
  };
  queryKey?: string;
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
