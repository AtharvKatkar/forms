import React from "react";

import FormTitleCard from "@/features/editor/components/form-title-card";
import EditorActions from "@/features/editor/components/editor-actions";
import FormFields from "@/features/editor/components/form-fields";

function EditFormPage() {
  return (
    <div className="relative flex gap-3 py-6">
      <div className="flex w-full flex-col items-center gap-3">
        {/* Title card */}
        <FormTitleCard />
        {/* Form fields */}
        <FormFields />
      </div>
      {/* Editor actions */}
      <EditorActions />
    </div>
  );
}

export default EditFormPage;
