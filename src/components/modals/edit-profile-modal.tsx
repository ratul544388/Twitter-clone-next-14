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
import { zodResolver } from "@hookform/resolvers/zod";
import { InvalidateQueryFilters, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useState } from "react";
import { useModal } from "@/hooks/use-modal-store";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Avatar } from "../avatar";
import { Button } from "../ui/button";
import Icon from "../icon";
import { Input } from "../ui/input";
import Textarea from "../textarea";

const formSchema = z.object({
  name: z.string().min(2).max(30),
  username: z.string().min(2).max(20),
  bio: z.string().max(500),
  image: z.string(),
  coverPhoto: z.string(),
});

export const EditProfileModal = ({ currentUser }: { currentUser: User }) => {
  const router = useRouter();
  const { isOpen, onClose, data, type } = useModal();

  const open = isOpen && type === "editProfileModal";

  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: currentUser.name,
      username: currentUser.username,
      bio: currentUser.bio || "",
      image: currentUser.image || "",
      coverPhoto: currentUser.coverPhoto || "",
    },
  });

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

  return (
    <div
      onClick={onClose}
      className={cn(
        "fixed z-50 inset-0 bg-background/80 backdrop-blur-sm opacity-0 pointer-events-none",
        open && "opacity-100 pointer-events-auto"
      )}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "w-[500px] shadow-lg overflow-hidden rounded-xl bg-background border absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all opacity-20",
          open && "opacity-100"
        )}
      >
        <div className="sticky h-[50px] bg-background/80">
          <Icon icon={X} className="absolute left-1 top-1/2 -translate-y-1/2" />
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 p-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      value={field.value}
                      onChange={field.onChange}
                      label="Full name"
                      limit={30}
                    />
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
                    <Input
                      value={field.value}
                      onChange={field.onChange}
                      label="Username"
                      limit={30}
                    />
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
                      limit={30}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <div className="sticky bg-background py-2 px-3 border-t flex items-center">
          <Button className="ml-auto">Save</Button>
        </div>
      </div>
    </div>
  );
};
