import { FullTweetType } from "@/types";
import { User } from "@prisma/client";
import { create } from "zustand";

export type ModalType =
  | "editTweetModal"
  | "deleteTweetModal"
  | "editProfileModal"
  | "registerModal"
  | "loginModal"
  | "tweetModal"
  | "quoteTweetModal"
  | "replyModal"
  | "createCommunityModal"
  | "leaveCommunityModal"
  | "logoutModal"
  | "cancelCommunityRequestModal"
  | "makingCommunityAdminModal"
  | "kickCommunityModal"
  | "imageModal";

interface ModalData {
  user?: User;
  tweet?: FullTweetType;
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

// const onClose = (set: any) => {
//   set({ type: null, isOpen: false });
//   const body = document.body.style;
//   setTimeout(() => {
//     if (body.pointerEvents === "none") {
//       body.pointerEvents = "auto";
//     }
//   }, 400);
// };

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
