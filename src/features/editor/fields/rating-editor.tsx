import React from "react";
import type { Question } from "generated/prisma";
import { StarIcon } from "lucide-react";

import QuestionEditorShell from "../components/question-editor-shell";

const RATING_SCALE = 5;

type RatingEditorProps = Question;

function RatingEditor(props: RatingEditorProps) {
  return (
    <QuestionEditorShell {...props}>
      <div className="mt-3 flex items-center gap-2">
        {Array.from({ length: RATING_SCALE }).map((_, index) => (
          <StarIcon
            key={index}
            className="text-muted-foreground size-7"
            strokeWidth={1.5}
          />
        ))}
      </div>
    </QuestionEditorShell>
  );
}

export default RatingEditor;
