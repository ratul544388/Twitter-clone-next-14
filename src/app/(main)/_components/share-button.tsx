import { Tweet, User } from "@prisma/client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Icon from "@/components/icon";
import { PencilLine, Repeat2, Share } from "lucide-react";

interface ShareButtonProps {}

const ShareButton: React.FC<ShareButtonProps> = ({}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center cursor-pointer group hover:text-sky-500 outline-none select-none">
        <Icon icon={Share} className=" group-hover:bg-sky-50" iconSize={20} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Repeat2 className="h-4 w-4 mr-2" />
          Retweet
        </DropdownMenuItem>
        <DropdownMenuItem>
          <PencilLine className="h-4 w-4 mr-2" />
          Quote
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareButton;
