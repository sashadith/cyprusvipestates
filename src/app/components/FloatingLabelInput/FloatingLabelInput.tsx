"use client";
import React, { useState, ChangeEvent, FocusEvent } from "react";
import styles from "./FloatingLabelInput.module.scss";

type FloatingLabelInputProps = {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
};

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  label,
  name,
  type = "text",
  defaultValue = "",
}) => {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState(defaultValue);

  const handleFocus = () => setFocused(true);
  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (!e.target.value) {
      setFocused(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className={styles.inputContainer}>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        className={styles.inputField}
      />
      <label
        htmlFor={name}
        className={`${styles.floatingLabel} ${
          focused || value ? styles.active : ""
        }`}
      >
        {label}
      </label>
    </div>
  );
};

export default FloatingLabelInput;
