"use client";

import React, { useMemo } from "react";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";

import { Tabs, TabsTrigger, TabsList } from "@/components/ui/tabs";

function EditorNavigation() {
  const pathname = usePathname();
  const params = useParams();

  const tabs = useMemo(
    () => [
      {
        label: "Questions",
        href: `/${params.form as string}/edit`,
        active: pathname === `/${params.form as string}/edit`,
      },
      {
        label: "Responses",
        href: `/${params.form as string}/responses`,
        active: pathname === `/${params.form as string}/responses`,
      },
      {
        label: "Settings",
        href: `/${params.form as string}/settings`,
        active: pathname === `/${params.form as string}/settings`,
      },
    ],
    [pathname, params],
  );

  return (
    <div className="flex items-center justify-center">
      <Tabs className="font-heading">
        <TabsList variant="line">
          {tabs.map((value) => (
            <Link href={value.href} key={value.label}>
              <TabsTrigger
                className="data-active:text-primary after:bg-primary hover:text-primary"
                value={value.label}
                data-active={value.active}
              >
                {value.label}
              </TabsTrigger>
            </Link>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}

export default EditorNavigation;
