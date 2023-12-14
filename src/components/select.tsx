"use client";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
// import { formatText } from "@/helper";
import { Badge } from "@/components/ui/badge";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronDown } from "lucide-react";
import { useState } from "react";

interface SelectProps {
  items: string[];
  value?: string | string[];
  isMulti?: boolean;
  onChange: (value?: string | string[]) => void;
  placeholder: string;
  disabled?: boolean;
  filter?: boolean;
}

const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  isMulti,
  items,
  placeholder,
  disabled,
  filter,
}) => {
  const [open, setOpen] = useState(false);

  const handleClick = (selectedValue: string) => {
    if (isMulti && Array.isArray(value)) {
      if (value.includes(selectedValue)) {
        onChange(value.filter((item) => item !== selectedValue));
      } else {
        onChange([...value, selectedValue]);
      }
    } else {
      onChange(selectedValue);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={() => setOpen(!open)}>
      <PopoverTrigger asChild onClick={() => setOpen(true)}>
        <div
          className={cn(
            "flex bg-background items-center gap-2 border select-none hover:bg-accent cursor-pointer rounded-md w-full h-10 px-3 text-sm",
            disabled && "pointer-events-none opacity-60"
          )}
        >
          {Array.isArray(value) ? (
            value.length ? (
              value.map((item) => <Badge key={item}>{item}</Badge>)
            ) : (
              placeholder
            )
          ) : (
            <p className="capitalize">
              {(value && value.toLowerCase()) || placeholder}
            </p>
          )}
          <ChevronDown className="h-4 w-4 ml-auto" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0 max-h-[350px] overflow-y-auto">
        <Command>
          {filter && (
            <>
              <CommandInput placeholder="Search brands" />
              <CommandEmpty>No brand found</CommandEmpty>
            </>
          )}
          <CommandGroup>
            {items.map((item) => (
              <CommandItem
                key={item}
                value={item}
                onSelect={() => handleClick(item)}
                className="capitalize"
              >
                {isMulti && (
                  <Badge
                    className="h-5 w-5 p-0 rounded-sm border-[1.5px] mr-4"
                    variant={value?.includes(item) ? "default" : "outline"}
                  >
                    <CheckIcon
                      className={cn(
                        "h-4 w-4 text-white opacity-0",
                        value?.includes(item) && "opacity-100"
                      )}
                    />
                  </Badge>
                )}
                {item.toLowerCase()}
                {!isMulti && (
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === item ? "opacity-100" : "opacity-0"
                    )}
                  />
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default Select;
