"use client";
import { UploadButton } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { Image as ImageIcon, ImagePlus, Loader2 } from "lucide-react";
import { FC, useState } from "react";
interface IMediaUploadProps {
  onChange: (url?: string | string[]) => void;
  endPoint: "singlePhoto" | "multiMedia";
  disabled?: boolean;
  className?: string;
}

export const MediaUpload: FC<IMediaUploadProps> = ({
  onChange,
  endPoint,
  disabled,
  className,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div
      className={cn(
        "relative rounded-full hover:bg-sky-50",
        endPoint === "singlePhoto" &&
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/30 rounded-full",
        disabled && "pointer-events-none",
        className
      )}
    >
      <UploadButton
        appearance={{
          button: {
            opacity: 0,
          },
          allowedContent: {
            display: "none",
          },
        }}
        className={cn(
          "rounded-full h-full w-full overflow-hidden",
          endPoint === "singlePhoto" && "h-11 w-11",
          endPoint === "multiMedia" && "h-9 w-9"
        )}
        endpoint={endPoint}
        onClientUploadComplete={(res) => {
          onChange(
            endPoint === "singlePhoto" ? res?.[0].url : res?.map((r) => r.url)
          );
          setIsLoading(false);
        }}
        onUploadBegin={() => {
          setIsLoading(true);
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`);
        }}
      />
      {isLoading ? (
        <div className="w-full h-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      ) : endPoint === "singlePhoto" ? (
        <ImagePlus className="h-[21px] w-[21px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white pointer-events-none " />
      ) : (
        <ImageIcon className="h-[20px] w-[20px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary pointer-events-none" />
      )}
    </div>
  );
};
