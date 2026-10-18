import React from "react";
import { notFound } from "next/navigation";

import EditorHeader from "@/features/editor/components/editor-header";
import { api } from "@/trpc/server";

interface EditorLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    form: string
  }>
}

async function EditorLayout({ children, params }: EditorLayoutProps) {

  const {form} = await params;

  const formApi = await api.form.getOne({
    id: form
  })

  if(!formApi){
    return notFound()
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <EditorHeader />
      <main className="flex-1 bg-accent">{children}</main>
    </div>
  );
}

export default EditorLayout;
