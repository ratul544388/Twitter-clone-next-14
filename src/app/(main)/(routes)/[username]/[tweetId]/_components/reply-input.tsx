"use client";
import { Tweet, User } from "@prisma/client";
import * as z from "zod";

import { Avatar } from "@/components/avatar";
import { EmojiPicker } from "@/components/emoji-picker";
import { MediaUpload } from "@/components/media/media-upload";
import Textarea from "@/components/textarea";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { UploadPreview } from "@/components/upload-preview";
import { zodResolver } from "@hookform/resolvers/zod";
import { InvalidateQueryFilters, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const formSchema = z.object({
  caption: z.string().min(1).max(1000),
  media: z.array(z.string()),
});

interface ReplyInputProps {
  currentUser: User;
  tweet: Tweet;
}

const ReplyInput: React.FC<ReplyInputProps> = ({ currentUser, tweet }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caption: "",
      media: [],
    },
  });
  const caption = form.getValues("caption");
  const media = form.getValues("media");
  const router = useRouter();
  const [previewMedia, setPreviewMedia] = useState(media);
  const queryClient = useQueryClient();

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/tweets/${tweet.id}/reply`, {
        ...values,
      });
      toast.success("Tweet posted");
      form.reset();
      queryClient.invalidateQueries(["FOR YOU"] as InvalidateQueryFilters);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex relative flex-col pb-1 gap-1 pt-3 border-b-[1.5px]"
      >
        <div className="text-muted-foreground z-10 absolute top-0.5 text-sm ml-[53px]">
          Replying to <span className="text-primary">@ratul544</span>
        </div>
        <div className="flex items-start gap-3 mt-1.5">
          <Avatar
            onClick={() => router.push(`/${currentUser.username}`)}
            image={currentUser.image}
          />
          <FormField
            control={form.control}
            name="caption"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Textarea
                    className="min-h-[20px] pt-1.5"
                    placeholder="What's happening?!"
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      form.setValue("caption", value, {
                        shouldValidate: true,
                      });
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <UploadPreview
          value={previewMedia}
          onChange={(value) => setPreviewMedia(value)}
        />
        <div className="flex relative items-center pl-[42px]">
          <MediaUpload
            endPoint="multiMedia"
            onChange={(value) => {
              form.setValue("media", [...media, ...(value as string[])]);
              setPreviewMedia([...media, ...(value as string[])]);
            }}
            disabled={isLoading}
          />
          <EmojiPicker
            onChange={(emoji) => form.setValue("caption", caption + emoji)}
            disabled={isLoading}
          />
          <div className="flex items-center gap-3 ml-auto">
            <CircularProgressbar
              maxValue={300}
              value={caption.length}
              className="h-6 w-6"
              strokeWidth={15}
            />
            <Button disabled={isLoading || !caption.trim()} className="ml-auto">
              Reply
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default ReplyInput;
