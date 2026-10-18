import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SearchIcon } from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import UserButton from "@/features/auth/components/user-button";

function HomeHeader() {
  return (
    <header className="bg-background h-16 shadow">
      <nav className="container mx-auto grid h-full grid-cols-2 place-items-center md:grid-cols-3">
        <Link href="/" className="w-full">
          <Image src="/logo-text.svg" alt="Forms" height={48} width={128} />
        </Link>
        <InputGroup>
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput placeholder="Search" />
        </InputGroup>
        <div className="w-full flex justify-end">
            <UserButton />
        </div>
      </nav>
    </header>
  );
}

export default HomeHeader;
