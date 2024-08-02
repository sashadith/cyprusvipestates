"use client";
import React from "react";
import styles from "./ButtonModal.module.scss";
import { useModal } from "@/app/context/ModalContext";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export const ButtonModal = ({ children, className }: Props) => {
  const { openModal } = useModal();

  return (
    <button
      className={`${styles.buttonModal} ${className ? className : ""}`}
      onClick={openModal}
    >
      {children}
    </button>
  );
};
