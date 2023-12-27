"use client";

import { Button } from "@/components/ui/button";
import { checkBlueBadgeSubscription } from "@/lib/blue-badge-subscription";
import { UserWithBlueBadge } from "@/types";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import Header from "../../_components/header";
import { HiBadgeCheck, HiShieldCheck } from "react-icons/hi";
import Image from "next/image";
import { BadgeCheck, ShieldCheck, Star } from "lucide-react";
import { GiStarFormation } from "react-icons/gi";
import { Badge } from "@/components/ui/badge";
import { BsFillPeopleFill } from "react-icons/bs";
import { cn } from "@/lib/utils";
import { TbCircleCheckFilled } from "react-icons/tb";

interface BlueBadgeClientProps {
  user: UserWithBlueBadge;
}

export const BlueBadgeClient = ({ user }: BlueBadgeClientProps) => {
  const hasBlueBadge = checkBlueBadgeSubscription(user);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.get("/api/stripe");
      window.location.href = data.url;
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const iconMap = {
    blue: "text-blue-500",
    green: "text-emerald-500",
    golden: "text-yellow-500",
    red: "text-rose-500",
  };

  const features = [
    {
      icon: BadgeCheck,
      title: "Unlock Exclusive Content",
      description:
        "Verified users gain access to exclusive content and updates.",
      isUpcomming: false,
      color: iconMap["blue"],
    },

    {
      icon: HiShieldCheck,
      title: "Early Access to New Features",
      description:
        "Verified users will be the first to experience upcoming features.",
      isUpcoming: true,
      color: iconMap["green"],
    },

    {
      icon: GiStarFormation,
      title: "Priority Customer Support",
      description:
        "Verified users receive prioritized support to address any concerns.",
      isUpcoming: true,
      color: iconMap["golden"],
    },

    {
      icon: BsFillPeopleFill,
      title: "Connect with Verified Community Members",
      description:
        "Join a network of verified users and build valuable connections.",
      isUpcoming: true,
      color: iconMap["red"],
    },
  ];

  return (
    <div>
      <Header showBackButton>
        <h3 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-extrabold text-xl">
          Blue
        </h3>
      </Header>
      <div className="p-4 space-y-8 max-w-[500px] shadow-lg border mx-auto rounded-xl">
        <div className="flex items-center justify-between">
          {hasBlueBadge ? (
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold">You are a verified user</h1>
              <Button onClick={() => mutate()} variant="secondary">
                Manage your subscription
              </Button>
            </div>
          ) : (
            <h1 className="text-lg font-bold">
              Elevate your status with a Blue subscription—sport a distinctive
              blue badge and unlock upcoming features. Upgrade for exclusivity!
            </h1>
          )}
          <Image
            src="/images/twitter-blue-badge.svg"
            alt="blue-badge"
            width={100}
            height={100}
          />
        </div>
        <div className="space-y-4">
          {features.map((item) => (
            <div key={item.title} className="flex gap-5">
              <item.icon className={cn("h-14 w-14", item.color)} />
              <div className="space-y-1">
                {item.isUpcomming && (
                  <Badge
                    variant="outline"
                    className="text-primary bg-sky-500/10 dark:bg-blue-900/20"
                  >
                    Upcomming
                  </Badge>
                )}
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  {hasBlueBadge && (
                    <TbCircleCheckFilled className="h-5 w-5 min-w-[20px] text-primary" />
                  )}
                </div>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
          {!hasBlueBadge && (
            <div className="space-y-2 mt-5 flex flex-col items-center justify-center">
              <p>Limited time offer $9.99 USD/month</p>
              <Button
                onClick={() => mutate()}
                variant="secondary"
                className="w-full max-w-[400px]"
                disabled={isPending}
              >
                Subscribe
              </Button>
              <p className="underline text-sm">Purchase Terms of Service</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
