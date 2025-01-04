"use client";

import React, { useState } from "react";
import styles from "./NewsletterForm.module.scss";

type NewsletterFormProps = {
  placeholder: string;
  buttonLabel: string;
};

const NewsletterForm: React.FC<NewsletterFormProps> = ({
  placeholder,
  buttonLabel,
}) => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);

  const handleNewsletterSubmit = async () => {
    if (!email) {
      setMessage("Please enter a valid email address.");
      return;
    }

    try {
      const response = await fetch("/api/monday-newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage("You have successfully subscribed to our newsletter!");
        setEmail(""); // Очистка поля
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || "Failed to subscribe. Please try again.");
      }
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      setMessage("Failed to subscribe. Please try again later.");
    }
  };

  return (
    <div className={styles.newsLetterForm}>
      <input
        type="email"
        placeholder={placeholder}
        className={styles.newsLetterInput}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        className={styles.newsLetterButton}
        onClick={handleNewsletterSubmit}
      >
        {buttonLabel}
      </button>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default NewsletterForm;
