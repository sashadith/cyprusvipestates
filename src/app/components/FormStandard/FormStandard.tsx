"use client";

import { FC, useState, useEffect, useId } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import axios from "axios";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import styles from "./FormStandard.module.scss";
import { Form as FormType } from "@/types/form";
import Link from "next/link";
import { useRouter } from "next/navigation";

export type FormData = {
  name: string;
  phone: string;
  // country: string;
  preferredContact: string;
  email: string;
  agreedToPolicy: boolean;
};

export interface ContactFormProps {
  onFormSubmitSuccess?: () => void; // Функция обратного вызова для успешной отправки
  form: any;
  lang: string;
  offerButtonCustomText?: string;
}

const FormStandard: FC<ContactFormProps> = ({
  onFormSubmitSuccess,
  form,
  lang,
  offerButtonCustomText,
}) => {
  const uid = useId();
  const [message, setMessage] = useState<string | null>(null);
  const [filled, setFilled] = useState({
    name: false,
    phone: false,
    // country: false,
    email: false,
  });

  const dataForm = form.form;
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
    preferredContact: "",
    agreedToPolicy: false,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required(`${dataForm.validationNameRequired}`),
    phone: Yup.string().required(`${dataForm.validationPhoneRequired}`),
    // country: Yup.string().required(`${dataForm.validationCountryRequired}`),
    email: Yup.string()
      .email(`${dataForm.validationEmailInvalid}`)
      .required(`${dataForm.validationEmailRequired}`),
    preferredContact: Yup.string()
      .oneOf(["phone", "whatsapp", "email"])
      .required(
        lang === "ru"
          ? "Как с вами лучше связаться?"
          : lang === "de"
            ? "Wie können wir Sie am besten kontaktieren?"
            : lang === "pl"
              ? "Wybierz preferowaną formę kontaktu"
              : "What’s the best way to contact you?"
      ),
    agreedToPolicy: Yup.boolean()
      .required(`${dataForm.validationAgreementRequired}`)
      .oneOf([true], `${dataForm.validationAgreementOneOf}`),
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

        // GTM event
        if (typeof window !== "undefined" && window.dataLayer) {
          window.dataLayer.push({
            event: "form_submission_success",
            form_name: "standard_form",
            page_url: window.location.href,
          });
        }

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
            {/* Поле для имени */}
            <div className={styles.inputWrapper}>
              <svg
                className={styles.icon}
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="#bd8948"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
              </svg>
              <label
                // htmlFor="name"
                htmlFor={`${uid}-name`}
                className={`${styles.label} ${filled.name ? styles.filled : ""}`}
              >
                {dataForm.inputName}
              </label>
              <Field
                // id="name"
                id={`${uid}-name`}
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
                // htmlFor="phone"
                htmlFor={`${uid}-phone`}
                className={`${styles.label} ${styles.labelPhone} ${filled.phone ? styles.filled : ""}`}
              >
                {dataForm.inputPhone}
              </label>
              <PhoneInput
                // id="phone"
                id={`${uid}-phone`}
                name="phone"
                className={`${styles.inputField} ${styles.phoneInput}`}
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
              <svg
                className={styles.icon}
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="#bd8948"
                viewBox="0 0 24 24"
              >
                <path d="M12 13.5l-11-7.5v15h22v-15l-11 7.5zm0-2.5l11-7h-22l11 7z" />
              </svg>
              <label
                // htmlFor="email"
                htmlFor={`${uid}-email`}
                className={`${styles.label} ${filled.email ? styles.filled : ""}`}
              >
                {dataForm.inputEmail}
              </label>
              <Field
                // id="email"
                id={`${uid}-email`}
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

            <div className={styles.inputWrapper}>
              <p className={styles.radioGroupLabel}>
                {lang === "ru"
                  ? "Как с вами лучше связаться?"
                  : lang === "de"
                    ? "Wie können wir Sie am besten kontaktieren?"
                    : lang === "pl"
                      ? "W jaki sposób najlepiej się z Tobą skontaktować?"
                      : "What’s the best way to contact you?"}
              </p>
              <div className={styles.radioGroupWrapper}>
                <label className={styles.radioOption}>
                  <Field type="radio" name="preferredContact" value="phone" />
                  <span>
                    {lang === "ru"
                      ? "Позвоните мне"
                      : lang === "de"
                        ? "Rufen Sie mich an"
                        : lang === "pl"
                          ? "Zadzwońcie do mnie"
                          : "Phone call"}
                  </span>
                </label>

                <label className={styles.radioOption}>
                  <Field
                    type="radio"
                    name="preferredContact"
                    value="whatsapp"
                  />
                  <span>
                    {lang === "ru"
                      ? "Напишите в WhatsApp"
                      : lang === "de"
                        ? "Schreiben Sie mir auf WhatsApp"
                        : lang === "pl"
                          ? "Napisz na WhatsApp"
                          : "WhatsApp"}
                  </span>
                </label>

                <label className={styles.radioOption}>
                  <Field type="radio" name="preferredContact" value="email" />
                  <span>
                    {lang === "ru"
                      ? "Напишите на e-mail"
                      : lang === "de"
                        ? "Schreiben Sie mir eine E-Mail"
                        : lang === "pl"
                          ? "Napisz na e-mail"
                          : "Email"}
                  </span>
                </label>
              </div>

              <ErrorMessage
                name="preferredContact"
                component="div"
                className={styles.error}
              />
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
                ) : offerButtonCustomText ? (
                  offerButtonCustomText
                ) : (
                  dataForm.buttonText
                )}
              </button>
            </div>

            <div className={styles.customCheckbox}>
              <Field
                type="checkbox"
                name="agreedToPolicy"
                id={`${uid}-agreedToPolicy`}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFieldValue("agreedToPolicy", e.target.checked);
                }}
              />
              <ErrorMessage
                name="agreedToPolicy"
                component="div"
                className={styles.errorCheckbox}
              />
              <label htmlFor={`${uid}-agreedToPolicy`}>
                {dataForm.agreementText}{" "}
                <Link
                  className={styles.policyLink}
                  href={dataForm.agreementLinkDestination}
                  target="_blank"
                >
                  {dataForm.agreementLinkLabel}
                </Link>
              </label>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default FormStandard;
