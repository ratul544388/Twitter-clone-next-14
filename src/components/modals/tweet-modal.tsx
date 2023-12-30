"use client";

import { useModal } from "@/hooks/use-modal-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { InvalidateQueryFilters, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { Avatar } from "../avatar";
import { EmojiPicker } from "../emoji-picker";
import { MediaUpload } from "../media/media-upload";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Dialog, DialogContent, DialogFooter } from "../ui/dialog";
import { Separator } from "../ui/separator";
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
  const { tweet, communityId } = data;

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

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen && type === "tweetModal"} onOpenChange={handleClose}>
      <DialogContent className="px-4 pb-2 gap-2 pt-10 flex flex-col max-h-[100svh]">
        {communityId && (
          <h1 className="absolute top-1 left-1/2 -translate-x-1/2">
            Community Post
          </h1>
        )}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 flex-grow"
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
                        className="max-h-[84svh]"
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
        <Separator />
        <div className="flex items-center justify-between">
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
          <div className="flex items-center gap-3">
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
      </DialogContent>
    </Dialog>
  );
};
