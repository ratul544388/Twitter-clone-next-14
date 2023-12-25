"use client";
import { FC } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { Smile } from "lucide-react";
import { cn } from "@/lib/utils";
import Icon from "./icon";
import { useTheme } from "next-themes";
interface IEmojiPickerProps {
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const EmojiPicker: FC<IEmojiPickerProps> = ({ onChange, disabled }) => {
  const { resolvedTheme } = useTheme();
  return (
    <Popover>
      <PopoverTrigger>
        <Icon
          icon={Smile}
          className="text-primary hover:bg-sky-500/5 dark:hover:bg-sky-900/30"
          iconSize={20}
        />
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 pointer-events-auto z-[60]">
        <Picker
          data={data}
          theme={resolvedTheme}
          onEmojiSelect={(emoji: any) => onChange(emoji.native)}
          className={cn(disabled && "pointer-events-none opacity-50")}
        />
      </PopoverContent>
    </Popover>
  );
};
