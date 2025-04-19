"use client";
import React, { useState, FocusEvent } from "react";
import Select, {
  StylesConfig,
  SingleValue,
  MultiValue,
  ActionMeta,
} from "react-select";
import styles from "./FloatingSelect.module.scss";

export type OptionType = { label: string; value: string };

type FloatingSelectProps = {
  label: string;
  name: string;
  options: OptionType[];
  defaultValue?: OptionType | null;
  onChange?: (option: SingleValue<OptionType>) => void;
};

const FloatingSelect: React.FC<FloatingSelectProps> = ({
  label,
  name,
  options,
  defaultValue = null,
  onChange,
}) => {
  const [focused, setFocused] = useState(false);
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(
    defaultValue
  );

  const handleFocus = () => setFocused(true);
  const handleBlur = (e: FocusEvent) => {
    if (!selectedOption) {
      setFocused(false);
    }
  };

  const handleChange = (
    newValue: SingleValue<OptionType> | MultiValue<OptionType>,
    actionMeta: ActionMeta<OptionType>
  ) => {
    // Если вы используете одиночный выбор, приводим значение к SingleValue<OptionType>
    const singleOption = newValue as SingleValue<OptionType>;
    setSelectedOption(singleOption);
    if (onChange) {
      onChange(singleOption);
    }
  };

  const customStyles: StylesConfig<OptionType> = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "48px",
      height: "48px",
      borderColor: state.isFocused ? "#bd8948" : "#ccc",
      boxShadow: state.isFocused ? "0 0 0 1px #bd8948" : "none",
      "&:hover": { borderColor: state.isFocused ? "#bd8948" : "#aaa" },
      padding: "0 5px",
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "1rem 0.5rem 0.5rem",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      // marginTop: "-3px", // Поднимаем стрелку
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      height: "60%",
    }),
    singleValue: (provided) => ({
      ...provided,
      marginTop: "-10px", // Поднимаем выбранный текст
    }),
    clearIndicator: (provided) => ({
      ...provided,
      // marginTop: "-1px", // Поднимаем индикатор-крестик
    }),
    input: (provided) => ({
      ...provided,
      marginTop: "-8px", // Поднимаем вводимый текст и курсор
    }),
    placeholder: (provided) => ({
      ...provided,
      display: "none",
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 3,
    }),
    option: (provided, state) => ({
      ...provided,
      // Если опция выбрана, используем основной цвет, иначе при ховере – прозрачную версию
      backgroundColor: state.isSelected
        ? "#bd8948"
        : state.isFocused
          ? "rgba(170, 127, 46, 0.2)"
          : provided.backgroundColor,
      color: state.isSelected ? "#fff" : provided.color,
      cursor: "pointer",
      ":active": {
        backgroundColor: "#bd8948",
      },
    }),
  };

  return (
    <div className={styles.selectContainer}>
      <Select
        name={name}
        options={options}
        value={selectedOption}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        styles={customStyles}
        isClearable
      />
      <label
        htmlFor={name}
        className={`${styles.floatingLabel} ${
          focused || selectedOption ? styles.active : ""
        }`}
      >
        {label}
      </label>
    </div>
  );
};

export default FloatingSelect;
