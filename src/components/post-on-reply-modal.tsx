import Image from "next/image";
import { Avatar } from "./avatar";
import Dot from "./dot";
import { Separator } from "./ui/separator";
import { FullTweetType } from "@/types";
import { MediaPreview } from "./media/media-preview";

interface PostOnReplyModalProps {
  tweet: FullTweetType;
}

const PostOnReplyModal: React.FC<PostOnReplyModalProps> = ({ tweet }) => {
  return (
    <div className="flex relative items-start gap-3 rounded-2xl">
      <Separator
        className="absolute h-full w-[3px] rounded-full left-5 -translate-x-1/2 top-[50px]"
        orientation="vertical"
        style={{ height: "calc(100% - 40px)" }}
      />
      <Avatar image={tweet.user.image} />
      <div className="flex flex-col w-full">
        <div className="flex items-center gap-2">
          <div className="font-semibold line-clamp-1">{tweet.user.name}</div>
          <p className="text-muted-foreground line-clamp-1">
            @{tweet.user.username}
          </p>
          <Dot />
          <p className="text-muted-foreground">10h</p>
        </div>
        <p>{tweet.caption}</p>
        {!!tweet.media.length && <MediaPreview tweet={tweet} />}
        <div className="flex gap-2 text-muted-foreground text-sm">
          Replying to <p className="text-primary">@{tweet.user.username}</p>
        </div>
      </div>
    </div>
  );
};

export default PostOnReplyModal;
