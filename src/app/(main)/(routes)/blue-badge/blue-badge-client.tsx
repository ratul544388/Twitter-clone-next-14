"use client"

import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

interface BlueBadgeClientProps {
  currentUser: User;
}

export const BlueBadgeClient = ({
    currentUser,
} : BlueBadgeClientProps) => {

  const {} = useQuery({
    queryKey: [""]
  })
  return (
     <div>
        BlueBadgeClient
     </div>
    );
}
