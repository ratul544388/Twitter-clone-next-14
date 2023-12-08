"use client";
import { FC } from "react";
import { Button } from "./ui/button";
import { IconType } from "react-icons";
import { cn } from "@/lib/utils";
interface ISocialLoginButtonProps {
  label: string;
  icon: IconType;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export const SocialLoginButton: FC<ISocialLoginButtonProps> = ({
  label,
  icon: Icon,
  onClick,
  disabled,
  className,
}) => {
  const handleClick = () => {
    // toast({
    //   title:
    //     "Cannot login with Google for now try login with email and password",
    // });
  };
  return (
    <Button
      onClick={handleClick}
      className={cn("flex items-center h-11 gap-2", className)}
      disabled={disabled}
      variant="secondary"
      type="button"
    >
      <Icon className="h-6 w-6" />
      {label}
    </Button>
  );
};
