"use client";

import { FC, useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import axios from "axios";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import styles from "./FormStatic.module.scss";
import { Form as FormType } from "@/types/form";
import Link from "next/link";
import { useRouter } from "next/navigation";

export type FormData = {
  name: string;
  phone: string;
  // country: string;
  email: string;
  agreedToPolicy: boolean;
};

export interface ContactFormProps {
  onFormSubmitSuccess?: () => void; // Функция обратного вызова для успешной отправки
  lang: string;
}

const FormStatic: FC<ContactFormProps> = ({ onFormSubmitSuccess, lang }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [filled, setFilled] = useState({
    name: false,
    phone: false,
    email: false,
  });

  const router = useRouter(); // Используйте useRouter из next/navigation

  useEffect(() => {
    const interval = setInterval(() => {
      ["name", "phone", "email"].forEach((field) => {
        const input = document.getElementById(field) as HTMLInputElement;
        if (input && input.value) {
          setFilled((f) => ({ ...f, [field]: true }));
        }
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilled((prev) => ({ ...prev, [name]: value.trim() !== "" }));
  };

  const initialValues: FormData = {
    name: "",
    phone: "",
    // country: "",
    email: "",
    agreedToPolicy: false,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required(
      lang === "ru"
        ? "Имя обязательно"
        : lang === "de"
          ? "Name ist erforderlich"
          : lang === "pl"
            ? "Imię jest wymagane"
            : "Name is required"
    ),
    phone: Yup.string().required(
      lang === "ru"
        ? "Телефон обязателен"
        : lang === "de"
          ? "Telefon ist erforderlich"
          : lang === "pl"
            ? "Telefon jest wymagany"
            : "Phone is required"
    ),
    email: Yup.string()
      .email(
        lang === "ru"
          ? "Неверный формат email"
          : lang === "de"
            ? "Ungültige E-Mail Adresse"
            : lang === "pl"
              ? "Nieprawidłowy format email"
              : "Invalid email address"
      )
      .required(
        lang === "ru"
          ? "Email обязателен"
          : lang === "de"
            ? "E-Mail ist erforderlich"
            : lang === "pl"
              ? "Email jest wymagany"
              : "Email is required"
      ),
    agreedToPolicy: Yup.boolean()
      .required(
        lang === "ru"
          ? "Согласие обязательно"
          : lang === "de"
            ? "Zustimmung erforderlich"
            : lang === "pl"
              ? "Zgoda jest wymagana"
              : "Consent is required"
      )
      .oneOf(
        [true],
        lang === "ru"
          ? "Требуется согласие"
          : lang === "de"
            ? "Einverständnis erforderlich"
            : lang === "pl"
              ? "Wymagane wyrażenie zgody"
              : "Consent required"
      ),
  });

  const onSubmit = async (
    values: FormData,
    { setSubmitting, resetForm }: FormikHelpers<FormData>
  ) => {
    setSubmitting(true);
    try {
      const currentPage = window.location.href; // Получаем текущий URL
      const response = await axios.post("/api/monday", {
        ...values,
        currentPage,
      });
      if (response.status === 200) {
        resetForm({});
        setFilled({ name: false, phone: false, email: false });
        onFormSubmitSuccess && onFormSubmitSuccess();
        setMessage(
          lang === "ru"
            ? "Мы получили вашу заявку и свяжемся с вами в ближайшее время."
            : lang === "de"
              ? "Wir haben Ihre Anfrage erhalten und werden uns in Kürze bei Ihnen melden."
              : lang === "pl"
                ? "Otrzymaliśmy Twoje zapytanie i skontaktujemy się z Tobą wkrótce."
                : "We have received your request and will contact you shortly."
        );
        setTimeout(() => {
          setMessage(null);
        }, 5000);
      } else {
        throw new Error("Failed to send lead to monday.com");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage(
        lang === "ru"
          ? "Произошла ошибка при отправке заявки. Попробуйте позже."
          : lang === "de"
            ? "Beim Senden der Anfrage ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut."
            : lang === "pl"
              ? "Wystąpił błąd podczas wysyłania zapytania. Spróbuj ponownie później."
              : "An error occurred while sending the request. Please try again later."
      );
      setTimeout(() => {
        setMessage(null);
      }, 7000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleButtonClick = () => {
    console.log("Button clicked");
  };

  return (
    <>
      {message && <div className={styles.popup}>{message}</div>}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>
            <div className={styles.form}>
              <div className="container">
                <h2 className={styles.title}>
                  {lang === "ru"
                    ? "Оставьте заявку и мы свяжемся с вами в ближайшее время"
                    : lang === "de"
                      ? "Lassen Sie sich von uns beraten"
                      : lang === "pl"
                        ? "Zostaw zapytanie, a my skontaktujemy się z Tobą wkrótce"
                        : "Leave your request and we will contact you shortly"}
                </h2>
                <div className={styles.formWrapper}>
                  <div className={styles.inputs}>
                    <div className={styles.inputWrapper}>
                      <label
                        htmlFor="name"
                        className={`${styles.label} ${filled.name ? styles.filled : ""}`}
                      >
                        {lang === "ru"
                          ? "Ваше имя"
                          : lang === "de"
                            ? "Ihr Name"
                            : lang === "pl"
                              ? "Imię"
                              : "Your name"}
                      </label>
                      <Field
                        id="name"
                        name="name"
                        type="text"
                        className={`${styles.inputField}`}
                        onBlur={handleBlur}
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className={styles.error}
                      />
                    </div>

                    <div className={styles.inputWrapper}>
                      <label
                        htmlFor="phone"
                        className={`${styles.label} ${styles.labelPhone} ${filled.phone ? styles.filled : ""}`}
                      >
                        {lang === "ru"
                          ? "Телефон"
                          : lang === "de"
                            ? "Telefon"
                            : lang === "pl"
                              ? "Telefon"
                              : "Phone"}
                      </label>
                      <PhoneInput
                        id="phone"
                        name="phone"
                        className={`${styles.inputField}`}
                        onBlur={handleBlur}
                        onChange={(value) => setFieldValue("phone", value)}
                      />
                      <ErrorMessage
                        name="phone"
                        component="div"
                        className={styles.error}
                      />
                    </div>

                    <div className={styles.inputWrapper}>
                      <label
                        htmlFor="email"
                        className={`${styles.label} ${filled.email ? styles.filled : ""}`}
                      >
                        {lang === "ru"
                          ? "Ваш email"
                          : lang === "de"
                            ? "E-Mail Adresse"
                            : lang === "pl"
                              ? "E-mail"
                              : "Email"}
                      </label>
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        className={`${styles.inputField}`}
                        onBlur={handleBlur}
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className={styles.error}
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className={styles.sentBtn}
                      disabled={isSubmitting}
                      onClick={handleButtonClick}
                    >
                      {isSubmitting ? (
                        <div className={styles.loader}></div>
                      ) : lang === "ru" ? (
                        "Отправить"
                      ) : lang === "de" ? (
                        "Absenden"
                      ) : lang === "pl" ? (
                        "Wyślij"
                      ) : (
                        "Send"
                      )}
                    </button>
                  </div>
                </div>
                <div className={styles.customCheckbox}>
                  <Field
                    type="checkbox"
                    name="agreedToPolicy"
                    id="agreedToPolicy"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setFieldValue("agreedToPolicy", e.target.checked);
                    }}
                  />
                  <ErrorMessage
                    name="agreedToPolicy"
                    component="div"
                    className={styles.errorCheckbox}
                  />
                  <label htmlFor="agreedToPolicy">
                    {lang === "ru"
                      ? "Я согласен с "
                      : lang === "de"
                        ? "Ich habe die Bedingungen der "
                        : lang === "pl"
                          ? "Zgadzam się z "
                          : "I agree with the terms of the "}
                    <Link
                      className={styles.policyLink}
                      href={
                        lang === "ru"
                          ? "/ru/politika-privatnosti"
                          : lang === "de"
                            ? "/datenschutzrichtlinie"
                            : lang === "pl"
                              ? "/pl/polityka-prywatnosci"
                              : "/en/privacy-policy"
                      }
                      target="_blank"
                    >
                      {lang === "ru"
                        ? "Пользовательским соглашением"
                        : lang === "de"
                          ? "Benutzervereinbarung"
                          : lang === "pl"
                            ? "Umowa użytkownika"
                            : "User agreement"}
                    </Link>
                    {lang === "ru"
                      ? " прочитал и принимаю их"
                      : lang === "de"
                        ? " gelesen und akzeptiere sie"
                        : lang === "pl"
                          ? " przeczytałem i akceptuję je"
                          : " read and accept them"}
                  </label>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default FormStatic;
