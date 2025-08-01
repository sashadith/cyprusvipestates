"use client";

import { FC, useState, useEffect, useId } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import axios from "axios";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import styles from "./FormPartners.module.scss";
import Link from "next/link";
import { useRouter } from "next/navigation";

export type FormData = {
  name: string;
  surname: string;
  phone: string;
  email: string;
  country: string;
  agreedToPolicy: boolean;
};

export interface ContactFormProps {
  onFormSubmitSuccess?: () => void;
  form?: any;
  lang: string;
  offerButtonCustomText?: string;
}

const FormPartners: FC<ContactFormProps> = ({
  onFormSubmitSuccess,
  form,
  lang,
  offerButtonCustomText,
}) => {
  const uid = useId();
  const [message, setMessage] = useState<string | null>(null);
  const [filled, setFilled] = useState({
    name: false,
    surname: false,
    phone: false,
    email: false,
    country: false,
  });

  const dataForm = form.form;
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      ["name", "surname", "phone", "email", "country"].forEach((field) => {
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
    surname: "",
    phone: "",
    email: "",
    country: "",
    agreedToPolicy: false,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required(`${dataForm.validationNameRequired}`),
    phone: Yup.string().required(`${dataForm.validationPhoneRequired}`),
    // country: Yup.string().required(`${dataForm.validationCountryRequired}`),
    email: Yup.string()
      .email(`${dataForm.validationEmailInvalid}`)
      .required(`${dataForm.validationEmailRequired}`),
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
      const response = await axios.post("/api/email", {
        ...values,
        currentPage,
      });
      if (response.status === 200) {
        resetForm({});
        setFilled({
          name: false,
          surname: false,
          phone: false,
          email: false,
          country: false,
        });

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
                htmlFor={`${uid}-surname`}
                className={`${styles.label} ${filled.surname ? styles.filled : ""}`}
              >
                {lang === "en"
                  ? "Surname"
                  : lang === "ru"
                    ? "Фамилия"
                    : lang === "de"
                      ? "Nachname"
                      : lang === "pl"
                        ? "Nazwisko"
                        : "Surname"}
              </label>
              <Field
                id={`${uid}-surname`}
                name="surname"
                type="text"
                className={`${styles.inputField}`}
                onBlur={handleBlur}
              />
              <ErrorMessage
                name="surname"
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
              <label
                htmlFor={`${uid}-country`}
                className={`${styles.label} ${filled.country ? styles.filled : ""}`}
              >
                {lang === "en"
                  ? "Country"
                  : lang === "ru"
                    ? "Страна"
                    : lang === "de"
                      ? "Land"
                      : lang === "pl"
                        ? "Kraj"
                        : "Country"}
              </label>
              <Field
                id={`${uid}-country`}
                name="country"
                type="text"
                className={`${styles.inputField}`}
                onBlur={handleBlur}
              />
              <ErrorMessage
                name="country"
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

export default FormPartners;
