"use client";
import Icon from "@/components/icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/use-modal-store";
import { useOrigin } from "@/hooks/use-origin";
import { FullTweetType } from "@/types";
import { User } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import toast from "react-hot-toast";

interface PostMenuProps {
  currentUser: User | null;
  tweet: FullTweetType;
  queryKey: string;
}

const PostMenu: React.FC<PostMenuProps> = ({
  tweet,
  queryKey,
  currentUser,
}) => {
  const queryClient = useQueryClient();
  const { onOpen } = useModal();
  const origin = useOrigin();
  let menu = [
    {
      label: "Copy tweet link",
      icon: Copy,
      onClick: () => {
        navigator.clipboard.writeText(
          origin + `/${tweet.user.username}/${tweet.id}`
        );
        toast.success("Tweet link compied to clipboard");
      },
    },
  ];
  if (currentUser?.id === tweet.user.id) {
    menu = [
      ...menu,
      {
        label: "Edit",
        icon: Edit,
        onClick: () => onOpen("tweetModal", { tweet }),
      },
      {
        label: "Delete",
        icon: Trash,
        onClick: () => {}
      },
    ];
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        onClick={(e) => e.stopPropagation()}
        className="ml-auto outline-none"
      >
        <Icon
          icon={MoreHorizontal}
          className="text-muted-foreground"
          iconSize={16}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent onClick={(e) => e.stopPropagation()} align="end">
        {menu.map((item) => (
          <DropdownMenuItem key={item.label} onClick={item.onClick}>
            <item.icon className="h-4 w-4 mr-2" />
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PostMenu;
