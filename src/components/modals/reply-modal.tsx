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
import PostOnReplyModal from "../post-on-reply-modal";

const formSchema = z.object({
  caption: z.string().min(1).max(1000),
  media: z.array(z.string()),
});

export const ReplyModal = ({ currentUser }: { currentUser: User }) => {
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

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/tweets/${tweet?.id}/reply`, {
        ...values,
        tweetId: tweet?.id,
      });
      toast.success("Replied");
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
    <Dialog open={isOpen && type === "replyModal"} onOpenChange={handleClose}>
      <DialogContent className="px-4 pb-2 gap-2 pt-12 flex flex-col max-h-[100svh] xs:max-h-[80svh]">
        <div className="flex-1 flex-grow overflow-y-auto scrollbar-thin">
          {tweet && <PostOnReplyModal tweet={tweet} />}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
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
                          className="max-h-[30svh]"
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
        </div>
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
