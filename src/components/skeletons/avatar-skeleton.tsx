import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

interface AvatarSkeletonProps {
  size?: number;
}

const AvatarSkeleton: React.FC<AvatarSkeletonProps> = ({ size }) => {
  return (
    <Skeleton
      className="min-h-[40px] min-w-[40px] rounded-full"
      style={{ height: size, width: size }}
    />
  );
};

export default AvatarSkeleton;
