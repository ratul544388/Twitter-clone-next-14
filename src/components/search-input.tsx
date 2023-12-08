"use client";

import { cn } from "@/lib/utils";
import { FullUserType } from "@/types";
import { User } from "@prisma/client";
import axios from "axios";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { SingleUser } from "./single-user";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";

export const SearchInput = ({
  currentUser,
  className,
  autoFocus,
}: {
  currentUser: User;
  className?: string;
  autoFocus?: boolean;
}) => {
  const [results, setResults] = useState<FullUserType[]>();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [debouncedValue] = useDebounce(value, 500);
  const containerRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(containerRef, () => setOpen(false));

  const fetchPeople = useCallback(async () => {
    const { data } = await axios.get(`/api/search/?q=${value}`);
    setResults(data?.items);
  }, []);

  useEffect(() => {
    if (autoFocus) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 500);
    }
  }, [autoFocus]);

  useEffect(() => {
    if (debouncedValue) {
      fetchPeople();
    }
  }, [debouncedValue, fetchPeople]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/explore/search/?q=${value}`);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={(e) => handleSubmit(e)} className="relative w-full">
        <input
          className={cn(
            "ring-[1px] outline-none ring-input focus:ring-primary focus:ring-[2px] peer border-0 w-full rounded-full h-10 pl-3 pr-8",
            className
          )}
          ref={inputRef}
          placeholder="Search..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setOpen(true)}
        />
        <SearchIcon className="h-5 w-5 absolute top-1/2 -translate-y-1/2 right-2 peer-focus:text-primary" />
      </form>
      {open && value && (
        <div
          ref={containerRef}
          className="flex z-10 w-full flex-col gap-3 py-3 absolute top-12 bg-background shadow-md rounded-xl"
        >
          {value && (
            <div className="flex px-3 items-center gap-3 text-muted-foreground text-sm">
              {`Search for "${value}"`}
              <SearchIcon className="h-4 w-4" />
            </div>
          )}
          {results &&
            results.map((user: FullUserType) => (
              <SingleUser
                key={user.id}
                currentUser={currentUser}
                user={user}
                queryKey=""
              />
            ))}
        </div>
      )}
    </div>
  );
};
