"use client"

import React from "react";
import { ChevronsUpDownIcon, EllipsisVerticalIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import NewTemplateButton from "./new-template-button";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";

function Templates() {
    const isMobile = useIsMobile()

  return (
    <section className="bg-accent">
      <div className="container mx-auto px-3 py-6 space-y-3">
        {/* template actions */}
        <div className="flex items-center justify-between gap-6">
          <h4 className="font-heading">Start a new form</h4>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="hover:bg-primary/5">
              <ChevronsUpDownIcon />
              Template gallery
            </Button>
            <Separator orientation="vertical" />
            <Button variant="ghost" size="icon" className="hover:bg-primary/5">
              <EllipsisVerticalIcon />
            </Button>
          </div>
        </div>
        {/* Templates */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
          <NewTemplateButton />
          {new Array(isMobile ? 1 : 5).fill(null).map((_, key) => (
            <Skeleton key={key} className="h-44 w-full bg-primary/5" />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Templates;
