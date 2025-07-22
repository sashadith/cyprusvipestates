"use client";
import React, {
  useState,
  ChangeEvent,
  FocusEvent,
  useEffect,
  forwardRef,
} from "react";
import styles from "./FloatingLabelInput.module.scss";

export type FloatingLabelInputProps = {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  value?: string; // если захотите полностью контролировать извне
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

const FloatingLabelInput = forwardRef<
  HTMLInputElement,
  FloatingLabelInputProps
>(
  (
    {
      label,
      name,
      type = "text",
      defaultValue = "",
      value,
      onChange,
      className,
    },
    ref
  ) => {
    // если value передан — контролируемый режим, иначе внутренний стейт
    const [innerValue, setInnerValue] = useState(defaultValue);
    const isControlled = value !== undefined;

    // синхронизируем внутреннее значение, если поменялся defaultValue
    useEffect(() => {
      if (!isControlled) {
        setInnerValue(defaultValue);
      }
    }, [defaultValue, isControlled]);

    const currentValue = isControlled ? value! : innerValue;

    const [focused, setFocused] = useState(Boolean(currentValue));

    const handleFocus = () => setFocused(true);

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
      if (!e.target.value) setFocused(false);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setInnerValue(e.target.value);
      onChange?.(e);
    };

    return (
      <div className={`${styles.inputContainer} ${className ?? ""}`}>
        <input
          ref={ref}
          id={name}
          name={name}
          type={type}
          value={currentValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          className={styles.inputField}
        />
        <label
          htmlFor={name}
          className={`${styles.floatingLabel} ${
            focused || currentValue ? styles.active : ""
          }`}
        >
          {label}
        </label>
      </div>
    );
  }
);

FloatingLabelInput.displayName = "FloatingLabelInput";
export default FloatingLabelInput;
