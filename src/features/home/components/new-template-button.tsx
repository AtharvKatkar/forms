"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { api } from "@/trpc/react";
import { toast } from "@/components/ui/toast";

function NewTemplateButton() {
  const router = useRouter();

  const createFormApi = api.form.create.useMutation({
    onSuccess: (id) => {
      toast.add({
        title: "Form created",
      });
      router.push(`/${id}/edit`);
    },
    onError: (error) => {
      toast.add({
        title: error.message,
      });
    },
  });

  return (
    <button
      className="group grid h-44 w-full grid-rows-[0.85fr_0.15fr] gap-1.5 disabled:opacity-70"
      onClick={async () => createFormApi.mutateAsync()}
      disabled={createFormApi.isPending}
    >
      <span className="hover:border-primary relative overflow-hidden rounded border transition">
        <Image
          src="/blank-form.png"
          alt="Blank form"
          fill
          className="object-cover object-center"
        />
      </span>
      <p className="font-heading flex w-full items-start text-sm">Blank form</p>
    </button>
  );
}

export default NewTemplateButton;
