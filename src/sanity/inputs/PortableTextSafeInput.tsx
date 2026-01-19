import { PortableTextInput } from "sanity";
import { useMemo } from "react";

export default function PortableTextSafeInput(props: any) {
  const safeValue = useMemo(() => {
    return Array.isArray(props.value) ? props.value : [];
  }, [props.value]);

  return <PortableTextInput {...props} value={safeValue} />;
}
