import React, { FC } from "react";
import styles from "./NoProjects.module.scss";

type Props = {
  lang: string;
};

const NoProjects: FC<Props> = ({ lang }) => {
  return (
    <div
      className={styles.noProjects}
      style={{ margin: "2rem 0", textAlign: "center" }}
    >
      {lang === "en"
        ? "No projects found."
        : lang === "de"
          ? "Keine Projekte gefunden."
          : lang === "pl"
            ? "Nie znaleziono projektów."
            : lang === "ru"
              ? "Проекты не найдены."
              : "No projects found."}
    </div>
  );
};

export default NoProjects;
