"use client";

import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import { cn } from "@/lib/utils";
import { FullUserType } from "@/types";
import axios from "axios";
import { SearchIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDebounce } from "use-debounce";
import { SingleUser } from "./single-user";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  onFocus?: () => void;
  results?: boolean;
  onSubmit?: () => void;
  className?: string;
}

export const SearchInput = ({
  value,
  onChange,
  placeholder = "Search...",
  autoFocus,
  onFocus,
  results,
  onSubmit,
  className,
}: SearchInputProps) => {
  const [searchedUsers, setSearchedUsers] = useState<FullUserType[]>();
  const [openCard, setOpenCard] = useState(false);
  const [debouncedValue] = useDebounce(value, 500);
  const containerRef = useRef(null);
  const searchParams = useSearchParams();

  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await axios(`/api/user-search/?q=${value}`);
      setSearchedUsers(data);
    } catch (error) {
      toast.error("Something went wrong");
    }
  }, [value]);

  useEffect(() => {
    if (debouncedValue && results) {
      fetchUsers();
    }
  }, [debouncedValue, results, fetchUsers]);

  const handleSubmit = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit();
    }
  };

  useOnClickOutside(containerRef, () => setOpenCard(false));

  return (
    <form onSubmit={handleSubmit} className={cn("relative w-full", className)}>
      <div className="relative w-full">
        <input
          className="rounded-full outline-none pl-3 pr-6 w-full h-9 peer ring-[1.5px] ring-border focus:ring-primary focus:ring-[2px] bg-accent/50"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setOpenCard(true)}
        />
        <SearchIcon className="h-5 w-5 absolute top-1/2 -translate-y-1/2 text-muted-foreground right-2 peer-focus:text-primary" />
      </div>
      {openCard && results && value && (
        <div
          ref={containerRef}
          className="absolute z-20 w-full py-3 mt-1 rounded-xl bg-background shadow-lg"
        >
          <div
            onClick={() => {}}
            className="p-2 pl-4 cursor-pointer hover:underline text-muted-foreground"
          >
            Search for <span className="text-foreground">{`"${value}"`}</span>
          </div>
          {searchedUsers?.map((user: FullUserType) => (
            <SingleUser key={user.id} user={user} />
          ))}
        </div>
      )}
    </form>
  );
};
