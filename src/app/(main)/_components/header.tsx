"use client";
import Icon from "@/components/icon";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import HeaderNavigations from "./header-navigations";
import { FullUserType, NavigationType } from "@/types";
import { SearchInput } from "@/components/search-input";
import { User } from "@prisma/client";
import { MobileSidebar } from "@/components/sidebar/mobile-sidebar";

interface HeaderProps {
  label: string;
  showBackButton?: boolean;
  navigations?: NavigationType[];
  border?: boolean;
  active?: NavigationType;
  onChange?: (value: NavigationType) => void;
  tweetCount?: number;
  hasSearchInput?: boolean;
  currentUser?: FullUserType;
  className?: string;
  autoFocusSearchInput?: boolean;
  mobileSidebar?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  label,
  showBackButton,
  border,
  navigations,
  active,
  onChange,
  tweetCount,
  hasSearchInput,
  currentUser,
  className,
  autoFocusSearchInput,
  mobileSidebar,
}) => {
  const router = useRouter();

  return (
    <div
      className={cn(
        "flex flex-col gap-2 bg-background sticky top-0 z-40",
        border && "border-b-[1.5px]",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center px-2 py-1 gap-2 xs:gap-4",
          !showBackButton && "pl-4"
        )}
      >
        {mobileSidebar && currentUser && (
          <MobileSidebar currentUser={currentUser} />
        )}
        {showBackButton && (
          <Icon icon={ArrowLeft} onClick={() => router.push("/")} />
        )}
        <div className="flex flex-col font-semibold text-lg">
          {label}
          <p className="text-xs text-muted-foreground">
            {tweetCount && `${tweetCount} tweets`}
          </p>
        </div>
        {hasSearchInput && currentUser && (
          <SearchInput
            currentUser={currentUser}
            className="h-9 pr-2"
            autoFocus={autoFocusSearchInput}
          />
        )}
      </div>
      {navigations && onChange && active && (
        <HeaderNavigations
          navigations={navigations}
          onChange={onChange}
          active={active}
        />
      )}
    </div>
  );
};

export default Header;
