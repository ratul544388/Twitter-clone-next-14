"use client";
import { FullCommunityType, FullUserType } from "@/types";
import { CommunityRole, User } from "@prisma/client";
import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Avatar } from "./avatar";
import { Skeleton } from "./ui/skeleton";

import { formatText } from "@/app/helper";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/use-modal-store";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Check, MoreVertical, ShieldAlert, Trash, User2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { FollowButton } from "./follow-button";
import Icon from "./icon";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface UserProps {
  user: FullUserType;
  hasFollowButton?: boolean;
  hasBio?: boolean;
  currentUser?: User;
  queryKey?: string;
  clickToProfile?: boolean;
  community?: FullCommunityType;
  hasApproveAndRejectButtons?: boolean;
  dropdownMenuForCommunityModerators?: boolean;
}

export const SingleUser = ({
  user,
  hasFollowButton,
  hasBio,
  currentUser,
  queryKey,
  clickToProfile,
  community,
  hasApproveAndRejectButtons,
  dropdownMenuForCommunityModerators,
}: UserProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { onOpen } = useModal();
  const [isLoading, setIsLoading] = useState(false);

  const member = community?.members.find((member) => {
    return member.userId === user.id;
  });

  const isAdmin = community?.members.some((member) => {
    return member.role === "ADMIN" && member.userId === currentUser?.id;
  });

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      await axios.post(`/api/communities/${community?.id}/requests/approve`, {
        userId: user.id,
      });
      toast.success("Approved");
      queryClient.invalidateQueries([queryKey] as InvalidateQueryFilters);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      await axios.post(`/api/communities/${community?.id}/requests/reject`, {
        userId: user.id,
      });
      toast.success("Rejected");
      queryClient.invalidateQueries([queryKey] as InvalidateQueryFilters);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeRole = async (role: CommunityRole) => {
    if (role === "ADMIN") {
      return onOpen("makingCommunityAdminModal", {
        member,
        community,
        queryKey,
      });
    }
    setIsLoading(true);
    try {
      await axios.patch(
        `/api/communities/${community?.id}/members/${member?.id}/change-role`,
        {
          role,
        }
      );
      toast.success(
        `${user.username} is now ${formatText(role)} of the community`
      );
      queryClient.invalidateQueries([queryKey] as InvalidateQueryFilters);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      onClick={() => clickToProfile && router.push(`/${user.username}`)}
      key={user.id}
      className="flex items-start gap-3 px-4 py-2 hover:bg-sky-50 dark:hover:bg-accent/30"
    >
      <Avatar
        image={user.image}
        onClick={() => router.push(`/${user.username}`)}
      />
      <div className="flex flex-col text-sm">
        <div className="flex items-center gap-3">
          <h1
            className="font-semibold cursor-pointer leading-4 hover:underline"
            onClick={() => router.push(`/${user.username}`)}
          >
            {user.name}
          </h1>
          {member?.role === "ADMIN" && <Badge>Admin</Badge>}
          {member?.role === "MODERATOR" && (
            <Badge variant="outline">Moderator</Badge>
          )}
        </div>
        <p className="text-muted-foreground">@{user.username}</p>
        {hasBio && <p className="mt-1 line-clamp-2">{user.bio}</p>}
      </div>
      <div className="flex items-center gap-3 ml-auto">
        {hasFollowButton && queryKey && (
          <FollowButton
            user={user}
            currentUser={currentUser}
            queryKey={queryKey}
            className={cn(user.id === currentUser?.id && "hidden")}
          />
        )}
        {hasApproveAndRejectButtons && community && queryKey && (
          <div className="flex gap-3">
            <Button
              onClick={handleReject}
              variant="destructive"
              disabled={isLoading}
            >
              Reject
            </Button>
            <Button onClick={handleApprove} disabled={isLoading}>
              Approve
            </Button>
          </div>
        )}
        {dropdownMenuForCommunityModerators &&
          user.id !== currentUser?.id &&
          member?.role !== "ADMIN" && (
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <Icon icon={MoreVertical} className="border" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {isAdmin && (
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="capitalize px-3">
                      {member?.role === "MODERATOR" ? (
                        <ShieldAlert className="h-4 w-4 mr-2" />
                      ) : (
                        <User2 className="h-4 w-4 mr-2" />
                      )}
                      {formatText(member?.role as string)}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        {Object.values(CommunityRole).map((role) => (
                          <DropdownMenuItem
                            disabled={isLoading}
                            onClick={() => handleChangeRole(role)}
                            key={role}
                            className="capitalize"
                          >
                            {formatText(role)}
                            {member?.role === role && (
                              <Check className="h-4 w-4 ml-4 text-muted-foreground" />
                            )}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                )}
                <DropdownMenuItem
                  onClick={() =>
                    onOpen("kickCommunityModal", {
                      community,
                      member,
                      queryKey,
                    })
                  }
                >
                  <Trash className="h-4 w-4 mr-2 text-red-500" />
                  <p className="text-red-500">Kick member</p>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
      </div>
    </div>
  );
};

SingleUser.Skeleton = function PeopleSkeleton({
  hasFollowButton,
  count,
  hasBio,
}: {
  count: number;
  hasFollowButton?: boolean;
  hasBio?: boolean;
}) {
  return (
    <div className="flex flex-col">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-start gap-3 px-4 py-3">
          <Avatar.Skeleton />
          <div className="flex flex-col w-full gap-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            {hasBio && (
              <>
                <Skeleton className="w-full h-3" />
                <Skeleton className="w-full h-3" />
              </>
            )}
          </div>
          {hasFollowButton && (
            <Skeleton className="h-8 w-24 ml-auto rounded-full" />
          )}
        </div>
      ))}
    </div>
  );
};
