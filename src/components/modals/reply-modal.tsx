"use client";

import { useModal } from "@/hooks/use-modal-store";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { InvalidateQueryFilters, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { Avatar } from "../avatar";
import { EmojiPicker } from "../emoji-picker";
import Icon from "../icon";
import { MediaUpload } from "../media/media-upload";
import Textarea from "../textarea";
import { Button } from "../ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { UploadPreview } from "../upload-preview";
import ViewOnlyPost from "../view-only-post";
import PostOnReplyModal from "../post-on-reply-modal";

const formSchema = z.object({
  caption: z.string().min(1).max(1000),
  media: z.array(z.string()),
});

export const ReplyModal = ({ currentUser }: { currentUser: User }) => {
  const { isOpen, onClose, data, type } = useModal();
  const open = isOpen && type === "replyModal";
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caption: "",
      media: [],
    },
  });
  const caption = form.getValues("caption");
  const media = form.getValues("media");
  const [mediaPreview, setMediaPreview] = useState(media);
  const queryClient = useQueryClient();
  const tweet = data.tweet;

  const handleClose = () => {
    onClose();
    form.reset();
  };

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/tweets/${tweet?.id}/reply`, {
        ...values,
      });
      toast.success("Replied");
      queryClient.invalidateQueries(["FOR YOU"] as InvalidateQueryFilters);
      form.reset();
      onClose();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div
      onClick={handleClose}
      className={cn(
        "fixed z-50 inset-0 bg-background/80 backdrop-blur-sm opacity-0 pointer-events-none",
        open && "opacity-100 pointer-events-auto"
      )}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "max-w-[500px] w-full shadow-lg overflow-hidden rounded-xl bg-background border absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all opacity-20",
          open && "opacity-100"
        )}
      >
        <div className="sticky h-[50px] bg-background/80">
          <Icon
            onClick={handleClose}
            icon={X}
            iconSize={20}
            className="absolute left-1 top-1/2 -translate-y-1/2"
          />
        </div>
        {tweet && <PostOnReplyModal tweet={tweet} />}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-start px-6 gap-3 overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 180px" }}
          >
            <Avatar image={currentUser?.image} />
            <FormField
              control={form.control}
              name="caption"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Textarea
                      placeholder="What's happening?!"
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        form.setValue("caption", value, {
                          shouldValidate: true,
                        });
                      }}
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <UploadPreview
          value={mediaPreview}
          onChange={(value) => setMediaPreview(value)}
        />
        <div className="sticky bg-background h-[50px] px-3 border-t flex items-center">
          <div className="flex">
            <MediaUpload
              endPoint="multiMedia"
              onChange={(value) => {
                form.setValue("media", [...media, ...(value as string[])]);
                setMediaPreview([...media, ...(value as string[])]);
              }}
              disabled={isLoading}
            />
            <EmojiPicker
              onChange={(emoji) => form.setValue("caption", caption + emoji)}
              disabled={isLoading}
            />
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <CircularProgressbar
              maxValue={300}
              value={caption.length}
              className="h-6 w-6"
              strokeWidth={15}
            />
            <Button
              disabled={isLoading || !caption.trim()}
              onClick={form.handleSubmit(onSubmit)}
            >
              Reply
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
