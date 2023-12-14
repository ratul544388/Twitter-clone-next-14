"use client";

import { Feed } from "@/app/(main)/_components/feed";
import { CommunityList } from "@/app/(main)/(routes)/communities/_components/community-list";
import { EmptyState } from "@/components/empty-state";
import Icon from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useModal } from "@/hooks/use-modal-store";
import { FullCommunityType } from "@/types";
import { User } from "@prisma/client";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { TbUsersPlus } from "react-icons/tb";
import Header from "../../../_components/header";

interface CommunitiesClientProps {
  communities: FullCommunityType[];
  currentUser: User;
}

export const CommunitiesClient = ({
  communities,
  currentUser,
}: CommunitiesClientProps) => {
  const router = useRouter();
  const { onOpen } = useModal();

  return (
    <div className="space-y-3">
      <Header label="Communities" showBackButton border className="py-1.5">
        <div className="flex w-full items-center justify-end gap-2">
          <Icon
            icon={Search}
            iconSize={20}
            onClick={() => router.push("/communities/suggested")}
          />
          <Icon
            icon={TbUsersPlus}
            iconSize={20}
            onClick={() => onOpen("communityModal")}
          />
        </div>
      </Header>
      {!communities.length ? (
        <EmptyState title="You are not member of any community yet. Join some communities to see there posts. You can also create your own community.">
          <div className="flex items-center gap-3 justify-center">
            <Button variant="outline" onClick={() => onOpen("communityModal")}>
              Create community
            </Button>
            <Button onClick={() => router.push(`/communities/recomended`)}>
              Join community
            </Button>
          </div>
        </EmptyState>
      ) : (
        <>
          <CommunityList variant="ROW" />
          <Separator />
          <Feed currentUser={currentUser} type="COMMUNITIES_TWEETS" />
        </>
      )}
    </div>
  );
};
