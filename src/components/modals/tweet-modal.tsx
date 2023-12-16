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
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { UploadPreview } from "../upload-preview";

const formSchema = z.object({
  caption: z.string().min(1).max(1000),
  media: z.array(z.string()),
});

export const TweetModal = ({ currentUser }: { currentUser: User }) => {
  const { isOpen, onClose, data, type } = useModal();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caption: "",
      media: [],
    },
  });
  const caption = form.getValues("caption");
  const media = form.getValues("media");
  const queryClient = useQueryClient();
  const open = isOpen && type === "tweetModal";
  const { tweet, communityId } = data;

  const handleClose = () => {
    onClose();
    form.reset();
  };

  useEffect(() => {
    if (tweet) {
      form.setValue("caption", tweet.caption);
      form.setValue("media", tweet.media, { shouldValidate: true });
    }
  }, [data, form, tweet]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (tweet) {
        await axios.patch(`/api/tweets/${tweet.id}`, {
          ...values,
          communityId,
        });
      } else {
        await axios.post("/api/tweets", {
          ...values,
          communityId,
        });
      }
      toast.success(tweet ? "Tweet updated" : "Tweet posted");
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
        <div className="sticky flex items-center justify-center h-[50px] bg-background/80">
          <Icon
            onClick={handleClose}
            icon={X}
            iconSize={20}
            className="absolute left-1 top-1/2 -translate-y-1/2"
          />
          <h1 className="font-semibold text-muted-foreground">
            {communityId && "Community post"}
          </h1>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="px-6 space-y-2 overflow-y-auto pb-3"
            style={{ maxHeight: "calc(100vh - 180px" }}
          >
            <div className="flex items-start">
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
                        onChange={(e) => {
                          form.setValue("caption", e.target.value, {
                            shouldValidate: true,
                          });
                        }}
                        rows={1}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <UploadPreview
              value={media}
              onChange={(value) =>
                form.setValue("media", value, { shouldValidate: true })
              }
            />
          </form>
        </Form>
        <div className="sticky bg-background h-[50px] px-3 border-t flex items-center">
          <div className="flex">
            <MediaUpload
              endPoint="multiMedia"
              onChange={(value) => {
                form.setValue("media", [...media, ...(value as string[])], {
                  shouldValidate: true,
                });
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
              Tweet
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
