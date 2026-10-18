import React from "react";

import FormTitleCard from "@/features/editor/components/form-title-card";
import EditorActions from "@/features/editor/components/editor-actions";

function EditFormPage() {
  return (
    <div className="relative flex gap-3 py-6">
      <div className="flex flex-col items-center gap-3 w-full">
        {/* Title card */}
        <FormTitleCard />
      </div>
      {/* Editor actions */}
      <EditorActions />
    </div>
  );
}

export default EditFormPage;
