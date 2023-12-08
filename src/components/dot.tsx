import { cn } from "@/lib/utils";

interface DotProps {
  className?: string;
}
const Dot: React.FC<DotProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "h-[2.5px] w-[2.5px] rounded-full bg-muted-foreground",
        className
      )}
    />
  );
};

export default Dot;
