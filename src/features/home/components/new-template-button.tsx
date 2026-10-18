import React from "react";
import Image from "next/image";

function NewTemplateButton() {
  return (
    <button className="group grid h-44 w-full grid-rows-[0.85fr_0.15fr] gap-1.5">
      <span className="hover:border-primary relative overflow-hidden rounded border transition">
        <Image
          src="/blank-form.png"
          alt="Blank form"
          fill
          className="object-cover object-center"
        />
      </span>
      <p className="font-heading w-full flex items-start text-sm">Blank form</p>
    </button>
  );
}

export default NewTemplateButton;
