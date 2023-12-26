"use client";

import { Feed } from "@/app/(main)/_components/feed";
import Header from "@/app/(main)/_components/header";
import HeaderNavigations from "@/app/(main)/_components/header-navigations";
import { UserList } from "@/app/(main)/_components/user-list";
import Icon from "@/components/icon";
import { CoverPhoto } from "@/components/media/cover-photo";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/use-modal-store";
import { FullCommunityType, QueryType } from "@/types";
import { User } from "@prisma/client";
import { format } from "date-fns";
import {
  Calendar,
  Edit,
  Lock,
  MoreHorizontal,
  Share,
  Trash,
  Users2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CircularPhotos } from "../../_components/circular-photos";
import { CommunityJoiningButton } from "../../_components/community-joining-button";

interface CommunityIdClientProps {
  community: FullCommunityType;
  currentUser: User;
}

export const CommunityIdClient = ({
  community,
  currentUser,
}: CommunityIdClientProps) => {
  const isModerator = community.members.some((member) => {
    return (
      member.userId === currentUser.id &&
      (member.role === "ADMIN" || member.role === "MODERATOR")
    );
  });

  const creator = community.members.find((member) => {
    return member.role === "ADMIN";
  });

  const navigations: QueryType[] = isModerator
    ? ["TWEETS", "REQUESTS", "ABOUT"]
    : ["TWEETS", "ABOUT"];

  const [active, setActive] = useState<QueryType>("TWEETS");
  const { onOpen } = useModal();

  return (
    <div className="flex flex-col">
      <Header
        label={community.name}
        showBackButton
      backButtonUrl="/communities"
      >
        <>
          {creator?.userId === currentUser.id && (
            <DropdownMenu>
              <DropdownMenuTrigger className="ml-auto">
                <Icon icon={MoreHorizontal} className="border" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => onOpen("communityModal", { community })}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit community
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onOpen("deleteCommunityModal", { community })}
                >
                  <Trash className="h-4 w-4 mr-2 text-red-500" />
                  <p className="text-red-500">Delete community</p>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </>
      </Header>
      <CoverPhoto value={community.coverPhoto} className="h-[200px]" />
      <div className="h-3 w-full bg-sky-500/60" />
      <div className="flex flex-col gap-6 bg-primary text-white p-4">
        <h1 className="text-2xl font-bold">{community.name}</h1>
        <div className="flex sm:items-center justify-between gap-4 sm:flex-row flex-col">
          <div className="flex items-center gap-3">
            <CircularPhotos community={community} />
            <div className="flex items-center gap-2">
              <h1 className="font-bold">{community.members.length}</h1>
              <p className="text">Members</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Icon
              icon={Share}
              className="bg-white text-black p-2.5 hover:bg-white/90"
            />
            <CommunityJoiningButton
              community={community}
              currentUser={currentUser}
            />
          </div>
        </div>
      </div>
      <HeaderNavigations
        navigations={navigations}
        active={active}
        onChange={(value) => setActive(value)}
        border
      />
      {active === "TWEETS" ? (
        <Feed
          type="TWEETS"
          currentUser={currentUser}
          communityId={community.id}
        />
      ) : active === "REQUESTS" ? (
        <UserList
          type="REQUESTS"
          api={`/api/communities/${community.id}/requests`}
          community={community}
          hasApproveAndRejectButtons
        />
      ) : (
        <div className="space-y-4">
          <div className="p-4 space-y-4">
            <h1 className="font-extrabold text-xl">Community Info</h1>
            <div className="flex items-center gap-3">
              {community.type === "PRIVATE" ? (
                <Lock className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Users2 className="h-5 w-5" />
              )}
              <p className="font-semibold capitalize">
                {community.type.toLowerCase()}
              </p>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <p className="capitalize">
                Created {format(community.createdAt, "d MMMM yyyy")}{" "}
                <span className="text-foreground font-semibold">
                  By @{creator?.user.username}
                </span>
              </p>
            </div>
          </div>
          <h1 className="font-extrabold text-xl pl-4">Moderators</h1>
          <UserList
            currentUser={currentUser}
            api={`/api/communities/${community.id}/members`}
            type="COMMUNITY_MODERATORS"
            hasFollowButton
            hasBio
            community={community}
            take={3}
            loadOnces
            dropdownMenuForCommunityModerators
          />
          <h1 className="font-extrabold text-xl pl-4">Members</h1>
          <UserList
            currentUser={currentUser}
            api={`/api/communities/${community.id}/members`}
            type="COMMUNITY_MEMBERS"
            hasFollowButton
            hasBio
            community={community}
            take={8}
            loadOnces
            dropdownMenuForCommunityModerators
          />
          <Link
            href=""
            className={buttonVariants({
              variant: "link",
            })}
          >
            Show more
          </Link>
        </div>
      )}
    </div>
  );
};
