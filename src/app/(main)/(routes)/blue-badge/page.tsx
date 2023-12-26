"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";

const Page = () => {
  const handleSubscription = async () => {
    try {
      const response = await axios.get("/api/stripe");
      window.location.href = response.data.url;
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  return (
    <div>
      <Button onClick={handleSubscription}>Subscribe</Button>
    </div>
  );
};

export default Page;
