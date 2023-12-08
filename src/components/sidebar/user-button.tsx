import { User } from "@prisma/client";
import { LogOut, MoreHorizontal, User as UserIcon } from "lucide-react";
import { Avatar } from "../avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SignOutButton } from "@clerk/nextjs";

interface UserButtonProps {
  currentUser: User | null;
}

const UserButton: React.FC<UserButtonProps> = ({ currentUser }) => {
  if (!currentUser) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="w-fit rounded-full xl:w-full mt-auto"
      >
        <div
          role="button"
          className="flex items-center gap-1 p-2 hover:bg-accent"
        >
          <Avatar image={currentUser.image} />
          <div className="flex-col hidden xl:flex">
            <h1 className="font-semibold text-sm line-clamp-1">
              {currentUser.name}
            </h1>
            <p className="font-light text-sm text-muted-foreground line-clamp-1">
              @{currentUser.username}
            </p>
          </div>
          <MoreHorizontal className="h-4 w-4 text-muted-foreground ml-auto hidden xl:block" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="py-2 px-0">
        <DropdownMenuItem>
          <UserIcon className="h-4 w-4 mr-2" />
          Add an existing account
        </DropdownMenuItem>
        <DropdownMenuItem className="flex p-0">
          <SignOutButton>
            <div className="w-full h-full cursor-pointer py-2 flex items-center gap-2 p-3">
              <LogOut className="h-4 w-4" />
              Sign out
            </div>
          </SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
