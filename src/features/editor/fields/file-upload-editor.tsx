import React from "react";
import type { Question } from "generated/prisma";
import { CloudUploadIcon } from "lucide-react";

import QuestionEditorShell from "../components/question-editor-shell";

type FileUploadEditorProps = Question;

function FileUploadEditor(props: FileUploadEditorProps) {
  return (
    <QuestionEditorShell {...props}>
      <div className="border-input pointer-events-none mt-3 flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-8 text-center">
        <CloudUploadIcon className="text-muted-foreground size-8" />
        <p className="text-sm font-medium">Click or drag file to upload</p>
        <p className="text-muted-foreground text-xs">
          PDF, DOCX, PNG, JPG or any other file type
        </p>
      </div>
    </QuestionEditorShell>
  );
}

export default FileUploadEditor;
