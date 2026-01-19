// src/sanity/inputs/PortableTextSafeInput.tsx
import React, { useEffect } from "react";
import { ArrayOfObjectsInputProps, PatchEvent, setIfMissing } from "sanity";

export default function PortableTextSafeInput(props: ArrayOfObjectsInputProps) {
  const { value, onChange, renderDefault } = props;

  useEffect(() => {
    // Критично: при некоторых paste-сценариях value может быть null/undefined
    if (value == null) {
      onChange(PatchEvent.from(setIfMissing([])));
    }
  }, [value, onChange]);

  return renderDefault(props);
}
