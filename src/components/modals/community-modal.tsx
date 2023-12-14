"use client";

import { useModal } from "@/hooks/use-modal-store";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommunityType } from "@prisma/client";
import axios from "axios";
import { X } from "lucide-react";
import { useEffect } from "react";
import "react-circular-progressbar/dist/styles.css";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import Icon from "../icon";
import { Button } from "../ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import Select from "../select";
import { Input } from "../ui/input";
import { CoverPhoto } from "../media/cover-photo";

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Cover photo is required" })
    .max(30, { message: "Name can not contain more than 30 characters" }),
  coverPhoto: z
    .string({ required_error: "Cover photo is required" })
    .min(1, { message: "Cover photo is reqruied" }),
  type: z.nativeEnum(CommunityType),
});

export const CommunityModal = () => {
  const { isOpen, onClose, data, type } = useModal();
  const router = useRouter();
  const open = isOpen && type === "communityModal";
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      coverPhoto: "",
      type: undefined,
    },
  });
  const community = data.community;

  const handleClose = () => {
    onClose();
    form.reset();
  };

  useEffect(() => {
    if (community) {
      form.setValue("name", community.name);
      form.setValue("coverPhoto", community.coverPhoto);
      form.setValue("type", community.type);
    }
  }, [form, community]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (community) {
        await axios.patch(`/api/communities/${community.id}`, {
          ...values,
        });
      } else {
        await axios.post("/api/communities", {
          ...values,
        });
      }
      toast.success(community ? "Community Updated" : "Community Created");
      router.refresh();
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
          {community && (
            <h1 className="font-semibold text-muted-foreground">
              Edit community
            </h1>
          )}
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 pt-1 pb-5 gap-3 overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 180px" }}
          >
            <FormField
              control={form.control}
              name="coverPhoto"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <CoverPhoto
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-6 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isLoading}
                        label="Community name"
                        limit={30}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Select
                        disabled={isLoading}
                        items={Object.values(CommunityType).map((item) => item)}
                        placeholder="Community type"
                        value={field.value}
                        onChange={(value) =>
                          form.setValue("type", value as CommunityType)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <div className="sticky bg-background h-[50px] px-3 border-t flex items-center justify-end">
          <Button disabled={isLoading} onClick={form.handleSubmit(onSubmit)}>
            {community ? "Save" : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
};
