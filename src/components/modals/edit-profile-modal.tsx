"use client";
import { User } from "@prisma/client";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { useModal } from "@/hooks/use-modal-store";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import "react-circular-progressbar/dist/styles.css";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Icon from "../icon";
import { CoverPhoto } from "../media/cover-photo";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useEffect } from "react";
import { ProfilePhoto } from "../media/profile-photo";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { MediaUpload } from "../media/media-upload";
import { EmojiPicker } from "../emoji-picker";

const formSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(1, { message: "Name is required" })
    .max(30, { message: "Name can not be more than 30 characters in length" }),
  username: z
    .string({ required_error: "Username is required" })
    .min(1, { message: "Username is requried" })
    .max(20, { message: "Username can be more than 30 characters in length" }),
  bio: z
    .string()
    .max(500, { message: "Bio cannot be more than 500 characters in length" }),
  image: z.string(),
  coverPhoto: z.string(),
});

export const EditProfileModal = ({ currentUser }: { currentUser: User }) => {
  const router = useRouter();
  const { isOpen, onClose, data, type } = useModal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: currentUser.name,
      username: currentUser.username,
      bio: currentUser.bio || "",
      image: currentUser.image,
      coverPhoto: currentUser.coverPhoto || "",
    },
  });

  useEffect(() => {
    form.setValue("coverPhoto", currentUser.coverPhoto || "");
    form.setValue("image", currentUser.image);
    form.setValue("name", currentUser.name);
    form.setValue("username", currentUser.username);
    form.setValue("bio", currentUser.bio || "");
  }, [currentUser, form, isOpen]);


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data } = await axios.post(`/api/edit-profile`, {
        ...values,
      });
      onClose();
      router.refresh();
      router.push(`${data.username}`);
    } catch (error: any) {
      if (error?.response?.status === 409) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog
      open={isOpen && type === "editProfileModal"}
      onOpenChange={handleClose}
    >
      <DialogContent className="pb-2 px-0 gap-2 pt-12 flex flex-col h-[100svh] xs:max-h-[80svh]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="overflow-y-auto"
          >
            <FormField
              control={form.control}
              name="coverPhoto"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <CoverPhoto value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem className="w-full relative">
                  <FormControl>
                    <ProfilePhoto
                      value={field.value}
                      onChange={field.onChange}
                      className="absolute -translate-y-1/2 left-3"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-6 mt-16 p-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input {...field} label="Full name" limit={300} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input {...field} label="Username" limit={30} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Textarea
                        value={field.value}
                        onChange={field.onChange}
                        label="Bio"
                        limit={300}
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <Button
          disabled={form.formState.isSubmitting}
          className="ml-auto mr-4"
          onClick={form.handleSubmit(onSubmit)}
        >
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
};
