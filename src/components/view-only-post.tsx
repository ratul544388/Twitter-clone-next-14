import { cn } from "@/lib/utils";
import { FullTweetType } from "@/types";
import Image from "next/image";
import { Avatar } from "./avatar";
import Dot from "./dot";
import { UploadPreview } from "./upload-preview";
import { useRouter } from "next/navigation";

interface ViewOnlyPostProps {
  tweet: FullTweetType;
  className?: string;
}

const ViewOnlyPost: React.FC<ViewOnlyPostProps> = ({ tweet, className }) => {
  const router = useRouter();
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        router.push(`/${tweet.user.username}/status/${tweet.id}`);
      }}
      className={cn(
        "flex flex-col p-2 my-3 border rounded-2xl relative ml-[70px] mr-6",
        className
      )}
    >
      <div className="flex flex-col w-full">
        <div className="flex items-center gap-2">
          <Avatar image={tweet.user.image} size={20} />
          <div className="font-semibold line-clamp-1">{tweet.user.name}</div>
          <p className="text-muted-foreground line-clamp-1">
            @{tweet.user.username}
          </p>
          <Dot />
          <p className="text-muted-foreground">10h</p>
        </div>
        <p>{tweet.caption}</p>
        <UploadPreview value={tweet.media} className="border-none p-0 m-0" />
      </div>
    </div>
  );
};

export default ViewOnlyPost;
