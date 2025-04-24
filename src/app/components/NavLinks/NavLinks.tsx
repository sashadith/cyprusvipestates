"use client";
import Link from "next/link";
import { Header as HeaderType } from "@/types/header";
import styles from "../Header/Header.module.scss";
import { useEffect, useState } from "react";

type Props = {
  navLinks: HeaderType["navLinks"];
  params: { lang: string };
  closeMenu: () => void;
};

const NavLinks: React.FC<Props> = ({ navLinks, params, closeMenu }) => {
  const [activeSection, setActiveSection] = useState("");
  const [isHomePage, setIsHomePage] = useState(false);

  const getNormalizedHref = (lang: string, link: string) => {
    const normalizedLink = link.startsWith("/") ? link.slice(1) : link;
    const languagePrefix = lang === "de" ? "" : `/${lang}`;
    return `${languagePrefix}/${normalizedLink}`;
  };

  useEffect(() => {
    // Проверяем, находимся ли мы на главной странице
    setIsHomePage(window.location.pathname === `/${params.lang}`);

    const handleScroll = () => {
      let closestSectionId = "";
      let smallestDistance = Infinity;
      navLinks.forEach((navLink) => {
        const sectionElement = document.getElementById(navLink.link);
        if (sectionElement) {
          const distance = Math.abs(sectionElement.getBoundingClientRect().top);
          if (distance < smallestDistance) {
            smallestDistance = distance;
            closestSectionId = navLink.link;
          }
        }
      });

      setActiveSection(closestSectionId);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [navLinks, params.lang]);

  const scrollToSection = (sectionId: string) => {
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
      const offset =
        sectionElement.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({
        top: offset,
        behavior: "smooth",
      });
    } else if (!isHomePage) {
      // Перенаправление на главную страницу, если элемент не найден и не на главной странице
      window.location.href = `/${params.lang}/#${sectionId}`;
    }
  };

  if (!navLinks) {
    return null;
  }

  return (
    <nav className={styles.navLinks}>
      {navLinks.map((link) => {
        const isPageLink = link.link.startsWith("/");

        return (
          <div key={link.label}>
            {isPageLink ? (
              <Link
                href={getNormalizedHref(params.lang, link.link)}
                className={`${styles.navLink} ${
                  activeSection === link.link ? styles.active : ""
                }`}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ) : (
              <a
                href={`#${link.link}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.link);
                  closeMenu();
                }}
                className={`${styles.navLink} ${
                  activeSection === link.link ? styles.active : ""
                }`}
              >
                {link.label}
              </a>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default NavLinks;
