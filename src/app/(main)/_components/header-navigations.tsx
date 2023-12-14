import { cn } from "@/lib/utils";
import { QueryType } from "@/types";

interface HeaderNavigationsProps {
  navigations: QueryType[];
  active: QueryType;
  border?: boolean;
  onChange: (value: QueryType) => void;
}

const HeaderNavigations: React.FC<HeaderNavigationsProps> = ({
  navigations,
  active,
  border,
  onChange,
}) => {
  return (
    <div className={cn("flex justify-between select-none", border && "border-b-[1.5px]")}>
      {navigations.map((item) => (
        <div
          onClick={() => onChange(item)}
          key={item}
          className="grow hover:bg-blue-50 cursor-pointer py-3"
        >
          <div className="w-fit capitalize relative mx-auto font-medium">
            {item.toLowerCase()}
            <div
              className={cn(
                "absolute transition-all duration-300 h-[5px] w-0 bg-primary rounded-full -bottom-3",
                active === item && "w-full"
              )}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default HeaderNavigations;
