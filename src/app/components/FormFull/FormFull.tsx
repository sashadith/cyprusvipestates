"use client";

import { FC, useState, useEffect, useId, useRef } from "react";
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FormikHelpers,
  FormikProps,
} from "formik";
import * as Yup from "yup";
import axios from "axios";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import styles from "./FormFull.module.scss";
import Link from "next/link";
import { useRouter } from "next/navigation";

export type FormData = {
  name: string;
  surname: string;
  phone: string;
  email: string;
  message: string;
  preferredContact: string;
  agreedToPolicy: boolean;
  company: string; // honeypot
  formStartTime: number;
};

export interface ContactFormProps {
  onFormSubmitSuccess?: () => void;
  form: any;
  lang: string;
  offerButtonCustomText?: string;
}

const FormFull: FC<ContactFormProps> = ({
  onFormSubmitSuccess,
  form,
  lang,
  offerButtonCustomText,
}) => {
  const uid = useId();
  const [messagePopup, setMessagePopup] = useState<string | null>(null);

  const [filled, setFilled] = useState({
    name: false,
    surname: false,
    phone: false,
    email: false,
    message: false,
  });

  const dataForm = form.form;
  const router = useRouter();

  const [formStartTime, setFormStartTime] = useState(0);
  const formikRef = useRef<FormikProps<FormData> | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const f = formikRef.current;

      const fields = ["name", "surname", "email", "message"] as const;

      fields.forEach((field) => {
        const el = document.querySelector(`[name="${field}"]`) as
          | HTMLInputElement
          | HTMLTextAreaElement
          | null;

        const domVal = (el?.value ?? "").trim();
        const hasValue = Boolean(domVal);

        // ✅ autofill → Formik sync
        if (f && domVal && !String((f.values as any)[field] ?? "").trim()) {
          f.setFieldValue(field, domVal, false);
        }

        setFilled((prev) =>
          prev[field] === hasValue ? prev : { ...prev, [field]: hasValue },
        );
      });

      // ✅ phone отдельно
      const phoneEl = document.querySelector(
        `[name="phone"]`,
      ) as HTMLInputElement | null;

      const domPhone = (phoneEl?.value ?? "").trim();
      const phoneHasValue = Boolean(domPhone);

      if (f && domPhone && !String(f.values.phone ?? "").trim()) {
        f.setFieldValue("phone", domPhone, false);
      }

      setFilled((prev) =>
        prev.phone === phoneHasValue ? prev : { ...prev, phone: phoneHasValue },
      );
    }, 200);

    if (formStartTime === 0) {
      setFormStartTime(Date.now());
    }

    return () => clearInterval(interval);
  }, [formStartTime]);

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFilled((prev) => ({ ...prev, [name]: value.trim() !== "" }));
  };

  const initialValues: FormData = {
    name: "",
    surname: "",
    phone: "",
    email: "",
    message: "",
    preferredContact: "",
    agreedToPolicy: false,
    company: "",
    formStartTime: 0, // отправим реальное из state
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .transform((v) => (typeof v === "string" ? v.trim() : v))
      .required(`${dataForm.validationNameRequired}`),

    surname: Yup.string()
      .transform((v) => (typeof v === "string" ? v.trim() : v))
      .required(
        (dataForm as any).validationSurnameRequired ??
          dataForm.validationNameRequired,
      ),

    phone: Yup.string().required(`${dataForm.validationPhoneRequired}`),

    email: Yup.string()
      .transform((v) => (typeof v === "string" ? v.trim() : v))
      .email(`${dataForm.validationEmailInvalid}`)
      .required(`${dataForm.validationEmailRequired}`),

    message: Yup.string()
      .transform((v) => (typeof v === "string" ? v.trim() : v))
      .required(dataForm.validationMessageRequired!),

    preferredContact: Yup.string()
      .oneOf(["phone", "whatsapp", "email"])
      .required(
        lang === "ru"
          ? "Выберите удобный способ связи"
          : lang === "de"
            ? "Bitte bevorzugten Kontaktweg auswählen"
            : lang === "pl"
              ? "Wybierz preferowaną formę kontaktu"
              : "Please choose your preferred contact method",
      ),

    agreedToPolicy: Yup.boolean()
      .required(`${dataForm.validationAgreementRequired}`)
      .oneOf([true], `${dataForm.validationAgreementOneOf}`),
  });

  const onSubmit = async (
    values: FormData,
    { setSubmitting, resetForm }: FormikHelpers<FormData>,
  ) => {
    setSubmitting(true);

    try {
      const currentPage = window.location.href;

      const response = await axios.post("/api/monday", {
        ...values,
        phone: values.phone || "",
        formStartTime, // ✅ как в FormStandard
        currentPage,
        lang,
      });

      if (
        response.status === 200 &&
        response.data?.ok === true &&
        response.data?.created === true
      ) {
        resetForm({});
        setFilled({
          name: false,
          surname: false,
          phone: false,
          email: false,
          message: false,
        });

        if (typeof window !== "undefined" && window.dataLayer) {
          window.dataLayer.push({
            event: "form_submission_success",
            form_name: "form_full",
            page_url: window.location.href,
          });
        }

        onFormSubmitSuccess && onFormSubmitSuccess();

        setMessagePopup(
          lang === "ru"
            ? "Мы получили вашу заявку и свяжемся с вами в ближайшее время."
            : lang === "de"
              ? "Wir haben Ihre Anfrage erhalten und werden uns in Kürze bei Ihnen melden."
              : lang === "pl"
                ? "Otrzymaliśmy Twoje zapytanie i skontaktujemy się z Tobą wkrótce."
                : "We have received your request and will contact you shortly.",
        );

        setTimeout(() => setMessagePopup(null), 5000);
      } else {
        console.warn("Form blocked/failed:", response.data);
        throw new Error(response.data?.blocked || "blocked_or_failed");
      }
    } catch (error: any) {
      console.error("Error:", error);

      const blocked = error?.response?.data?.blocked;
      const okFalse = error?.response?.data?.ok === false;

      if (blocked || okFalse) {
        setMessagePopup(dataForm.spamBlockedMessage || dataForm.errorMessage);
      } else {
        setMessagePopup(
          lang === "ru"
            ? "Произошла ошибка при отправке заявки. Попробуйте позже."
            : lang === "de"
              ? "Beim Senden der Anfrage ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut."
              : lang === "pl"
                ? "Wystąpił błąd podczas wysyłania zapytania. Spróbuj ponownie później."
                : "An error occurred while sending the request. Please try again later.",
        );
      }

      setTimeout(() => setMessagePopup(null), 7000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {messagePopup && <div className={styles.popup}>{messagePopup}</div>}

      <Formik
        innerRef={(inst) => {
          formikRef.current = inst;
        }}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form>
            {/* Name */}
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
                htmlFor={`${uid}-name`}
                className={`${styles.label} ${filled.name ? styles.filled : ""}`}
              >
                {dataForm.inputName}
              </label>

              <Field name="name">
                {({ field }: any) => (
                  <input
                    {...field}
                    id={`${uid}-name`}
                    type="text"
                    className={styles.inputField}
                    onBlur={(e) => {
                      field.onBlur(e); // ✅ touched
                      handleBlur(e);
                    }}
                  />
                )}
              </Field>

              <ErrorMessage
                name="name"
                component="div"
                className={styles.error}
              />
            </div>

            {/* Surname */}
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
                htmlFor={`${uid}-surname`}
                className={`${styles.label} ${filled.surname ? styles.filled : ""}`}
              >
                {(dataForm as any).inputSurname ??
                  (lang === "ru"
                    ? "Фамилия"
                    : lang === "de"
                      ? "Nachname"
                      : lang === "pl"
                        ? "Nazwisko"
                        : "Surname")}
              </label>

              <Field name="surname">
                {({ field }: any) => (
                  <input
                    {...field}
                    id={`${uid}-surname`}
                    type="text"
                    className={styles.inputField}
                    onBlur={(e) => {
                      field.onBlur(e);
                      handleBlur(e);
                    }}
                    autoComplete="family-name"
                  />
                )}
              </Field>

              <ErrorMessage
                name="surname"
                component="div"
                className={styles.error}
              />
            </div>

            {/* Phone */}
            <div className={styles.inputWrapper}>
              <label
                htmlFor={`${uid}-phone`}
                className={`${styles.label} ${styles.labelPhone} ${
                  filled.phone ? styles.filled : ""
                }`}
              >
                {dataForm.inputPhone}
              </label>

              <PhoneInput
                id={`${uid}-phone`}
                name="phone"
                className={`${styles.inputField} ${styles.phoneInput}`}
                value={values.phone}
                onChange={(value) => {
                  setFieldValue("phone", value);
                  setFilled((f) => ({ ...f, phone: Boolean(value) }));
                }}
                onBlur={() => {
                  // ✅ важно: touched, иначе ErrorMessage может не показываться
                  formikRef.current?.setFieldTouched("phone", true, true);
                }}
              />

              <ErrorMessage
                name="phone"
                component="div"
                className={styles.error}
              />
            </div>

            {/* Email */}
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
                htmlFor={`${uid}-email`}
                className={`${styles.label} ${filled.email ? styles.filled : ""}`}
              >
                {dataForm.inputEmail}
              </label>

              <Field name="email">
                {({ field }: any) => (
                  <input
                    {...field}
                    id={`${uid}-email`}
                    type="email"
                    className={styles.inputField}
                    onBlur={(e) => {
                      field.onBlur(e); // ✅ touched
                      handleBlur(e);
                    }}
                  />
                )}
              </Field>

              <ErrorMessage
                name="email"
                component="div"
                className={styles.error}
              />
            </div>

            {/* Preferred contact */}
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
                      ? "Телефон"
                      : lang === "de"
                        ? "Anruf"
                        : lang === "pl"
                          ? "Telefonicznie"
                          : "Phone call"}
                  </span>
                </label>

                <label className={styles.radioOption}>
                  <Field
                    type="radio"
                    name="preferredContact"
                    value="whatsapp"
                  />
                  <span>WhatsApp</span>
                </label>

                <label className={styles.radioOption}>
                  <Field type="radio" name="preferredContact" value="email" />
                  <span>
                    {lang === "de"
                      ? "E-Mail"
                      : lang === "pl"
                        ? "E-mail"
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

            {/* Message */}
            <div className={styles.inputWrapper}>
              <label
                htmlFor={`${uid}-message`}
                className={`${styles.label} ${styles.labelMessage} ${
                  filled.message ? styles.filled : ""
                }`}
              >
                {dataForm.inputMessage}
              </label>

              <Field name="message">
                {({ field }: any) => (
                  <textarea
                    {...field}
                    id={`${uid}-message`}
                    className={styles.inputField}
                    onBlur={(e) => {
                      field.onBlur(e); // ✅ touched
                      handleBlur(e);
                    }}
                  />
                )}
              </Field>

              <ErrorMessage
                name="message"
                component="div"
                className={styles.error}
              />
            </div>

            {/* Honeypot */}
            <Field
              type="text"
              name="company"
              style={{ display: "none" }}
              tabIndex={-1}
              autoComplete="new-password"
              aria-hidden="true"
            />

            {/* Agreement */}
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

            {/* Submit */}
            <div>
              <button
                type="submit"
                className={styles.sentBtn}
                disabled={isSubmitting}
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
          </Form>
        )}
      </Formik>
    </>
  );
};

export default FormFull;
