"use client";
import { User } from "@prisma/client";
import * as z from "zod";
import { Avatar } from "./avatar";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InvalidateQueryFilters, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { EmojiPicker } from "./emoji-picker";
import { MediaUpload } from "./media/media-upload";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { UploadPreview } from "./upload-preview";
import { Separator } from "./ui/separator";

const formSchema = z.object({
  caption: z.string().min(1).max(1000),
  media: z.array(z.string()),
});

interface TweetInputProps {
  currentUser: User;
}

const TweetInput: React.FC<TweetInputProps> = ({ currentUser }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caption: "",
      media: [],
    },
  });
  const router = useRouter();
  const queryClient = useQueryClient();

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/tweets`, {
        ...values,
      });
      toast.success("Tweet posted");
      form.reset();
      queryClient.invalidateQueries([
        "FOR YOU",
        "FOLLOWING",
      ] as InvalidateQueryFilters);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const media = form.getValues("media");
  const caption = form.getValues("caption");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex relative flex-col gap-2 p-3 pb-1"
      >
        <div className="flex items-start">
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
                    className="text-base border-b-[1.5px] rounded-none"
                    placeholder="What is happening?!"
                    value={field.value}
                    onChange={(e) => {
                      form.setValue("caption", e.target.value, {
                        shouldValidate: true,
                      });
                    }}
                    rows={2}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <UploadPreview
          value={media}
          onChange={(value) =>
            form.setValue("media", value, {
              shouldValidate: true,
            })
          }
        />
        <Separator style={{ width: "calc(100% - 52px)", marginLeft: "auto" }} />
        <div className="flex relative items-center pl-[42px]">
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
          <div className="flex items-center gap-3 ml-auto">
            <CircularProgressbar
              maxValue={1000}
              value={form.getValues("caption").length}
              className="h-6 w-6"
              strokeWidth={15}
            />
            <Button disabled={isLoading || !caption.trim()} className="ml-auto">
              Tweet
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default TweetInput;
