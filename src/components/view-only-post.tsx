import { cn } from "@/lib/utils";
import { FullTweetType } from "@/types";
import Image from "next/image";
import { Avatar } from "./avatar";
import Dot from "./dot";

interface ViewOnlyPostProps {
  tweet: FullTweetType;
  className?: string;
}

const ViewOnlyPost: React.FC<ViewOnlyPostProps> = ({ tweet, className }) => {
  return (
    <div
      className={cn(
        "flex flex-col p-3 my-3 border rounded-2xl relative ml-[52px]",
        className
      )}
    >
      <div className="flex flex-col w-full">
        <div className="flex items-center gap-2">
          <Avatar
            image={tweet.user.image}
            classname="min-h-[20px] min-w-[20px]"
          />
          <div className="font-semibold line-clamp-1">{tweet.user.name}</div>
          <p className="text-muted-foreground line-clamp-1">
            @{tweet.user.username}
          </p>
          <Dot />
          <p className="text-muted-foreground">10h</p>
        </div>
        <p>{tweet.caption}</p>
        {!!tweet.media.length && (
          <div className="aspect-[5/5] flex items-center justify-center w-full h-full relative mt-3">
            <Image
              src={tweet.media[0]}
              alt="Photo"
              fill
              className="rounded-xl border object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewOnlyPost;
