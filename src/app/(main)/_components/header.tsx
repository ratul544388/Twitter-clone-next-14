"use client";
import Icon from "@/components/icon";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import HeaderNavigations from "./header-navigations";
import { FullUserType, QueryType } from "@/types";
import { SearchInput } from "@/components/search-input";
import { User } from "@prisma/client";
import { MobileSidebar } from "@/components/sidebar/mobile-sidebar";
import { ReactNode } from "react";

interface HeaderProps {
  label?: string;
  showBackButton?: boolean;
  navigations?: QueryType[];
  border?: boolean;
  active?: QueryType;
  onChange?: (value: QueryType) => void;
  currentUser?: FullUserType;
  className?: string;
  mobileSidebar?: boolean;
  children?: ReactNode;
  backButtonUrl?: string;
}

const Header: React.FC<HeaderProps> = ({
  showBackButton,
  border,
  label,
  navigations,
  active,
  onChange,
  currentUser,
  className,
  mobileSidebar,
  children,
  backButtonUrl = "/",
}) => {
  const router = useRouter();

  return (
    <div
      className={cn(
        "realtive flex flex-col select-none gap-2 bg-background sticky top-0 z-40",
        border && "border-b-[1.5px]",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center p-2 gap-2",
          !showBackButton && "pl-4",
          mobileSidebar && "mt-2 xs:mt-0"
        )}
      >
        {mobileSidebar && currentUser && (
          <MobileSidebar currentUser={currentUser} />
        )}
        {showBackButton && (
          <Icon
            iconSize={20}
            icon={ArrowLeft}
            onClick={() => router.push(backButtonUrl)}
          />
        )}
        <p className="font-semibold text-lg">{label}</p>
        {children}
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
