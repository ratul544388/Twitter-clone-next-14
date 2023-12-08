import { Skeleton } from "../ui/skeleton";
import AvatarSkeleton from "./avatar-skeleton";

interface TweetSkeletonsProps {
  photo?: boolean;
  count: number;
}

const TweetSkeletons: React.FC<TweetSkeletonsProps> = ({ photo, count }) => {
  const getRandomSize = (min: number, max: number, parcent?: boolean) => {
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return `${randomNumber}${parcent ? "%" : "px"}`;
  };

  return (
    <div className="p-3 flex flex-col gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-start gap-3 w-full">
          <AvatarSkeleton />
          <div className="flex flex-col gap-3 w-full">
            <div className="flex gap-3 w-full mt-1">
              <Skeleton
                style={{ height: "25px", width: getRandomSize(60, 80) }}
              />
              <Skeleton
                style={{ height: "25px", width: getRandomSize(60, 80) }}
              />
              <Skeleton className="h-6 w-8" />
              <Skeleton className="h-6 w-6 rounded-full ml-auto" />
            </div>
            <Skeleton className="w-full h-6" />
            <Skeleton
              className="h-6"
              style={{ width: getRandomSize(40, 80, true) }}
            />
            {(index % 2 !== 0 || photo) && (
              <Skeleton
                className="w-full"
                style={{ height: getRandomSize(250, 320) }}
              />
            )}
            <div className="flex justify-between mt-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-6 w-9" />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TweetSkeletons;
