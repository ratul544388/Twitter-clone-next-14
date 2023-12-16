import Icon from "@/components/icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useOrigin } from "@/hooks/use-origin";
import { User } from "@prisma/client";
import { LinkIcon, Share } from "lucide-react";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";

interface ShareButtonProps {
  user: User;
}

const ShareButton: React.FC<ShareButtonProps> = ({ user }) => {
  const origin = useOrigin();

  const handleCopy = () => {
    navigator.clipboard.writeText(`${origin}/${user.username}`);
    toast.success("Tweet link was copied");
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center cursor-pointer group hover:text-sky-500 outline-none select-none">
        <Icon icon={Share} className=" group-hover:bg-sky-50" iconSize={20} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleCopy}>
          <LinkIcon className="h-4 w-4 mr-2" />
          Copy tweet link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareButton;
