import { User } from "@prisma/client";
import { usePathname } from "next/navigation";
import {
  BiEnvelope,
  BiHomeCircle,
  BiSolidEnvelope,
  BiSolidHomeCircle,
} from "react-icons/bi";
import { BsPeople, BsPeopleFill } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import {
  HiBadgeCheck,
  HiBell,
  HiOutlineBadgeCheck,
  HiOutlineBell,
  HiOutlineUser,
  HiUser,
} from "react-icons/hi";

export const useRoutes = ({
  currentUser,
  isBottomNavbar,
  isMobileSidebar,
}: {
  currentUser?: User;
  isBottomNavbar?: boolean;
  isMobileSidebar?: boolean;
}) => {
  const pathname = usePathname();
  let routes = [
    {
      label: "home",
      icon: pathname === "/" ? BiSolidHomeCircle : BiHomeCircle,
      href: "/",
      active: pathname === "/",
    },
    {
      label: "Explore",
      icon: pathname.includes("explore") ? FiSearch : FiSearch,
      href: "/explore",
      active: ["/explore", "/explore/search"].includes(pathname),
    },
    {
      label: "notifications",
      icon: pathname.includes("notifications") ? HiBell : HiOutlineBell,
      href: "/notifications",
      active: pathname === "/notifications",
    },
    {
      label: "messages",
      icon: pathname.includes("messages") ? BiSolidEnvelope : BiEnvelope,
      href: "/messages",
      active: pathname === "/messages",
    },
    {
      label: "Communities",
      icon: pathname.includes("communities") ? BsPeopleFill : BsPeople,
      href: `/communities`,
      active: [`/communities`].includes(pathname),
    },
    {
      label: "Blue badge",
      icon: pathname.includes("blue-badge")
        ? HiBadgeCheck
        : HiOutlineBadgeCheck,
      href: "/blue-badge",
      active: pathname === "/blue-badge",
    },
    {
      label: "profile",
      icon: pathname.includes(`/${currentUser?.username}`)
        ? HiUser
        : HiOutlineUser,
      href: `/${currentUser?.username}`,
      active: pathname === `/${currentUser?.username}`,
    },
  ];

  if (isMobileSidebar) {
    routes = [
      {
        label: "profile",
        icon: pathname.includes(`/${currentUser?.username}`)
          ? HiUser
          : HiOutlineUser,
        href: `/${currentUser?.username}`,
        active: pathname === `/${currentUser?.username}`,
      },
      {
        label: "notifications",
        icon: pathname.includes("notifications") ? HiBell : HiOutlineBell,
        href: "/notifications",
        active: pathname === "/notifications",
      },
      {
        label: "Blue badge",
        icon: pathname.includes("blue-badge")
          ? HiBadgeCheck
          : HiOutlineBadgeCheck,
        href: "/blue-badge",
        active: pathname === "/blue-badge",
      },
    ];
  }

  if (isBottomNavbar) {
    routes = [
      {
        label: "home",
        icon: pathname === "/" ? BiSolidHomeCircle : BiHomeCircle,
        href: "/",
        active: pathname === "/",
      },
      {
        label: "Explore",
        icon: pathname.includes("explore") ? FiSearch : FiSearch,
        href: "/explore",
        active: ["/explore", "/explore/search"].includes(pathname),
      },
      {
        label: "Communities",
        icon: pathname.includes("communities") ? BsPeopleFill : BsPeople,
        href: "/communities",
        active: ["/communities"].includes(pathname),
      },
      {
        label: "messages",
        icon: pathname.includes("messages") ? BiSolidEnvelope : BiEnvelope,
        href: "/messages",
        active: pathname === "/messages",
      },
    ];
  }

  return routes;
};
