import Image from "next/image";
import { FC } from "react";
import { Button } from "../ui/button";
import { X } from "lucide-react";
interface MediaPreviewProps {
  media: string[];
  onChange: (media: string[]) => void;
}

export const MediaPreview: FC<MediaPreviewProps> = ({ media, onChange }) => {
  const onRemove = (url: string) => {
    onChange(
      media.filter((item) => {
        return item !== url;
      })
    );
  };

  return (
    <div>
      {media.length > 0 && media.length > 1 ? (
        <div className="w-full grid grid-cols-5 gap-1">
          {media.map((item) => (
            <div key={item} className="w-20 h-20 border relative rounded-md overflow-hidden">
              <Image src={item} alt="image" fill className="object-cover" />
              <Button
                type="button"
                onClick={() => onRemove(item)}
                className="h-5 w-5 absolute top-0 right-0 z-50 bg-accent hover:bg-accent/80"
                size="icon"
                variant="outline"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-full w-full relative rounded-xl overflow-hidden">
          <Image
            src={media[0]}
            alt="Image"
            width={600}
            height={500}
            className=""
          />
          <Button
            type="button"
            onClick={() => onRemove(media[0])}
            className="h-7 w-7 absolute top-1 right-1 z-50 bg-accent hover:bg-accent/80"
            size="icon"
            variant="outline"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
