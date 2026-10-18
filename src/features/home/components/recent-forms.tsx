"use client";

import React from "react";

import { api } from "@/trpc/react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EllipsisVerticalIcon } from "lucide-react";

function RecentForms() {
  const isMobile = useIsMobile();

  const recentFormsApi = api.form.getAll.useQuery();

  return (
    <section className="container mx-auto space-y-3 px-3 py-6">
      <div className="flex items-center justify-between gap-6">
        <h4 className="font-heading">Recent forms</h4>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
        {recentFormsApi.isPending
          ? new Array(isMobile ? 1 : 5)
              .fill(null)
              .map((_, key) => (
                <Skeleton key={key} className="bg-primary/5 h-44 w-full" />
              ))
          : recentFormsApi.data?.map((form) => (
              <Link
                href={`/${form.id}/edit`}
                key={form.id}
                className="hover:border-primary flex h-64 w-full flex-col overflow-hidden rounded border transition"
              >
                <Skeleton className="h-full rounded-none" />
                <div className="flex items-center justify-between p-1.5">
                  <div className="flex flex-col">
                    <div className="font-heading truncate font-medium">
                      {form.name}
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Updated{" "}
                      {form.updatedAt.toLocaleString("default", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon-sm">
                    <EllipsisVerticalIcon />
                  </Button>
                </div>
              </Link>
            ))}
      </div>
    </section>
  );
}

export default RecentForms;
