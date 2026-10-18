import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
    EllipsisVerticalIcon,
  EyeIcon,
  Link2Icon,
  PaletteIcon,
  Redo2Icon,
  Undo2Icon,
  UserPlusIcon,
} from "lucide-react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import UserButton from "@/features/auth/components/user-button";
import RenameForm from "./rename-form";

function EditorHeader() {
  const formActions = [
    {
      Icon: PaletteIcon,
      label: "Theme",
    },
    {
      Icon: EyeIcon,
      label: "Preview",
    },
    {
      Icon: Undo2Icon,
      label: "Undo",
    },
    {
      Icon: Redo2Icon,
      label: "Redo",
    },
    {
      Icon: Link2Icon,
      label: "Copy responder link",
    },
    {
      Icon: UserPlusIcon,
      label: "Share",
    },
  ];

  return (
    <header className="bg-background sticky top-0 right-0 left-0 z-30 shadow">
      <nav className="container mx-auto flex flex-col gap-1.5 px-3 pt-3">
        {/* top layer */}
        <div className="flex items-center justify-between">
          {/* Top left */}
          <div className="flex items-center gap-3">
            <Link href="/">
              <Image src="/logo.svg" height={36} width={36} alt="Forms" />
            </Link>
            <RenameForm />
          </div>
          {/* Top right */}
          <div className="flex items-center gap-0.5">
            {formActions.map((value) => (
              <Button
                key={value.label}
                variant="ghost"
                size="icon-lg"
                className="rounded-full"
              >
                <value.Icon />
              </Button>
            ))}
            <Button>Publish</Button>
            <Button
              variant="ghost"
              size="icon-lg"
              className="rounded-full"
            >
              <EllipsisVerticalIcon />
            </Button>
            <UserButton />
          </div>
        </div>
        {/* bottom layer */}
        <div className="flex items-center justify-center">
          <Tabs className="font-heading">
            <TabsList variant="line">
              <TabsTrigger
                className="data-active:text-primary after:bg-primary hover:text-primary"
                value="edit"
              >
                Questions
              </TabsTrigger>
              <TabsTrigger
                className="data-active:text-primary after:bg-primary hover:text-primary"
                value="responses"
              >
                Responses
              </TabsTrigger>
              <TabsTrigger
                className="data-active:text-primary after:bg-primary hover:text-primary"
                value="settings"
              >
                Settings
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </nav>
    </header>
  );
}

export default EditorHeader;
