"use client";

import { i18n } from "@/i18n.config";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useMemo } from "react";
import styles from "./LocaleSwitcher.module.scss";
import { Translation } from "@/types/homepage";

type Props = {
  translations?: Translation[];
};

const LocaleSwitcher = ({ translations }: Props) => {
  const params = useParams();

  const availableTranslations = useMemo<Translation[]>(
    () =>
      i18n.languages.reduce<Translation[]>((acc, cur) => {
        const availableTranslation = translations?.find(
          (translation) => translation.language === cur.id
        );
        return availableTranslation ? [...acc, availableTranslation] : acc;
      }, []),
    [translations]
  );

  return (
    <label>
      <div className={styles.language}>
        {availableTranslations.map((version, index) => (
          <React.Fragment key={version.language}>
            <Link
              href={version.path}
              locale={version.language}
              className={`${
                params?.lang == version.language
                  ? styles.currentLang
                  : styles.switchLang
              }`}
            >
              {version.language}
            </Link>
            {index < availableTranslations.length - 1 && (
              <span className={styles.divider}></span>
            )}
          </React.Fragment>
        ))}
      </div>
    </label>
  );
};

export default LocaleSwitcher;
