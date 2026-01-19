import React, { useCallback } from "react";
import { ArrayOfObjectsInputProps, PatchEvent, type FormPatch } from "sanity";

type OnChangeArg = FormPatch | PatchEvent | FormPatch[];

function toPatchEvent(patch: OnChangeArg): PatchEvent {
  if (patch && typeof patch === "object" && "patches" in patch) {
    return patch as PatchEvent;
  }
  if (Array.isArray(patch)) return PatchEvent.from(patch as any);
  return PatchEvent.from([patch as any]);
}

function isRootPath(path: any): boolean {
  return Array.isArray(path) && path.length === 0;
}

export default function PortableTextSafeInput(props: ArrayOfObjectsInputProps) {
  const { onChange, renderDefault } = props;

  const handleChange = useCallback(
    (patch: OnChangeArg) => {
      const evt = toPatchEvent(patch);
      const patches: any[] = (evt as any)?.patches ?? [];

      // 1) Чиним "set в корень" если он пытается поставить не-массив
      // ВАЖНО: не добавляем новый патч, а модифицируем существующий set
      const fixed = patches.map((p) => {
        if (
          p?.type === "set" &&
          isRootPath(p?.path) &&
          !Array.isArray(p?.value)
        ) {
          return { ...p, value: [] };
        }
        return p;
      });

      // 2) Переставляем патчи: все root-set сначала, потом insert и остальное
      // Это важно для Ctrl+A/Ctrl+V: сначала значение становится [], потом insert применится к массиву
      const rootSets = fixed.filter(
        (p) => p?.type === "set" && isRootPath(p?.path),
      );
      const rest = fixed.filter(
        (p) => !(p?.type === "set" && isRootPath(p?.path)),
      );

      onChange(PatchEvent.from([...rootSets, ...rest] as any));
    },
    [onChange],
  );

  return renderDefault({
    ...props,
    onChange: handleChange,
  });
}
