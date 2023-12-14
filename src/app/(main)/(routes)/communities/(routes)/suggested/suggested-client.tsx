"use client";

import Header from "@/app/(main)/_components/header";
import { CommunityList } from "@/app/(main)/(routes)/communities/_components/community-list";
import { SearchInput } from "@/components/search-input";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SuggestedClientProps {}
