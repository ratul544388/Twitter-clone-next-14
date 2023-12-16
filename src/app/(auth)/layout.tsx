import Image from "next/image";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center min-h-screen justify-center">
      <Image
        src="/images/twitter-bg.jpg"
        alt="background-photo"
        fill
        className="object-cover"
      />
      {children}
    </div>
  );
}
