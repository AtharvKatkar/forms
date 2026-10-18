import React from "react";
import { notFound } from "next/navigation";

import EditorHeader from "@/features/editor/components/editor-header";
import { api } from "@/trpc/server";

interface EditorLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    form: string;
  }>;
}

async function EditorLayout({ children, params }: EditorLayoutProps) {
  const { form } = await params;

  const formApi = await api.form.getOne({
    id: form,
  });

  if (!formApi) {
    return notFound();
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <EditorHeader />
      <main className="bg-accent flex-1">
        <div className="container mx-auto px-3 w-full md:max-w-3xl">{children}</div>
      </main>
    </div>
  );
}

export default EditorLayout;
