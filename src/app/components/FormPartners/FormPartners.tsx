"use client";

import { FC, useEffect, useId, useRef, useState } from "react";
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

import styles from "./FormPartners.module.scss";
import Link from "next/link";
import { useRouter } from "next/navigation";

function tpl(str: string | undefined, vars: Record<string, string | number>) {
  return String(str ?? "").replace(/\{(\w+)\}/g, (_, k) =>
    vars[k] !== undefined ? String(vars[k]) : `{${k}}`
  );
}

const NAME_MIN = 2;
const NAME_MAX = 40;
const SURNAME_MIN = 2;
const SURNAME_MAX = 60;
const COUNTRY_MIN = 2;
const COUNTRY_MAX = 56;
const PHONE_MIN = 7;
const PHONE_MAX = 25;

export type FormData = {
  name: string;
  surname: string;
  phone: string;
  email: string;
  country: string;
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

const FormPartners: FC<ContactFormProps> = ({
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
    country: false,
  });

  const dataForm = form.form;
  const router = useRouter();

  const [formStartTime, setFormStartTime] = useState(0);
  const formikRef = useRef<FormikProps<FormData> | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const f = formikRef.current;

      const fields = ["name", "surname", "email", "country"] as const;

      fields.forEach((field) => {
        const el = document.querySelector(
          `[name="${field}"]`
        ) as HTMLInputElement | null;

        const domVal = (el?.value ?? "").trim();
        const hasValue = Boolean(domVal);

        // autofill → Formik
        if (f && domVal && !String(f.values[field] ?? "").trim()) {
          f.setFieldValue(field, domVal, false);
        }

        setFilled((prev) =>
          prev[field] === hasValue ? prev : { ...prev, [field]: hasValue }
        );
      });

      // phone отдельно
      const phoneEl = document.querySelector(
        `[name="phone"]`
      ) as HTMLInputElement | null;

      const domPhone = (phoneEl?.value ?? "").trim();
      const phoneHasValue = Boolean(domPhone);

      if (f && domPhone && !String(f.values.phone ?? "").trim()) {
        f.setFieldValue("phone", domPhone, false);
      }

      setFilled((prev) =>
        prev.phone === phoneHasValue ? prev : { ...prev, phone: phoneHasValue }
      );
    }, 200);

    if (formStartTime === 0) setFormStartTime(Date.now());
    return () => clearInterval(interval);
  }, [formStartTime]);

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
    company: "",
    formStartTime: 0, // отправим реальное из state
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .transform((v) => (typeof v === "string" ? v.trim() : v))
      .required(dataForm.validationNameRequired)
      .test("name-min", function (value) {
        const current = (value ?? "").trim().length;
        if (current >= NAME_MIN) return true;
        return this.createError({
          message: tpl(dataForm.validationNameTooShort, {
            min: NAME_MIN,
            current,
          }),
        });
      })
      .test("name-max", function (value) {
        const current = (value ?? "").trim().length;
        if (current <= NAME_MAX) return true;
        return this.createError({
          message: tpl(dataForm.validationNameTooLong, {
            max: NAME_MAX,
            current,
          }),
        });
      }),

    surname: Yup.string()
      .transform((v) => (typeof v === "string" ? v.trim() : v))
      .required(
        lang === "ru"
          ? "Фамилия обязательна"
          : lang === "de"
            ? "Nachname ist erforderlich"
            : lang === "pl"
              ? "Nazwisko jest wymagane"
              : "Surname is required"
      )
      .test("surname-min", function (value) {
        const current = (value ?? "").trim().length;
        if (current >= SURNAME_MIN) return true;
        return this.createError({
          message:
            lang === "ru"
              ? `Слишком короткая фамилия (минимум ${SURNAME_MIN})`
              : lang === "de"
                ? `Nachname ist zu kurz (mindestens ${SURNAME_MIN})`
                : lang === "pl"
                  ? `Nazwisko jest za krótkie (min. ${SURNAME_MIN})`
                  : `Surname is too short (min ${SURNAME_MIN})`,
        });
      })
      .test("surname-max", function (value) {
        const current = (value ?? "").trim().length;
        if (current <= SURNAME_MAX) return true;
        return this.createError({
          message:
            lang === "ru"
              ? `Слишком длинная фамилия (макс. ${SURNAME_MAX})`
              : lang === "de"
                ? `Nachname ist zu lang (max. ${SURNAME_MAX})`
                : lang === "pl"
                  ? `Nazwisko jest za długie (max ${SURNAME_MAX})`
                  : `Surname is too long (max ${SURNAME_MAX})`,
        });
      }),

    phone: Yup.string()
      .required(dataForm.validationPhoneRequired)
      .test("phone-min", function (value) {
        const current = String(value ?? "").trim().length;
        if (current >= PHONE_MIN) return true;
        return this.createError({
          message: tpl(dataForm.validationPhoneTooShort, {
            min: PHONE_MIN,
            current,
          }),
        });
      })
      .test("phone-max", function (value) {
        const current = String(value ?? "").trim().length;
        if (current <= PHONE_MAX) return true;
        return this.createError({
          message: tpl(dataForm.validationPhoneTooLong, {
            max: PHONE_MAX,
            current,
          }),
        });
      })
      .test("phone-format", function (value) {
        const v = String(value ?? "").trim();
        if (!v) return true;
        const ok = /^[+0-9()\-\s]{7,25}$/.test(v);
        if (ok) return true;
        return this.createError({
          message: dataForm.validationPhoneInvalid || "Invalid phone number",
        });
      }),

    email: Yup.string()
      .transform((v) => (typeof v === "string" ? v.trim() : v))
      .email(dataForm.validationEmailInvalid)
      .required(dataForm.validationEmailRequired),

    country: Yup.string()
      .transform((v) => (typeof v === "string" ? v.trim() : v))
      .required(
        lang === "ru"
          ? "Страна обязательна"
          : lang === "de"
            ? "Land ist erforderlich"
            : lang === "pl"
              ? "Kraj jest wymagany"
              : "Country is required"
      )
      .test("country-min", function (value) {
        const current = (value ?? "").trim().length;
        if (current >= COUNTRY_MIN) return true;
        return this.createError({
          message:
            lang === "ru"
              ? `Слишком короткое название страны (минимум ${COUNTRY_MIN})`
              : lang === "de"
                ? `Land ist zu kurz (mindestens ${COUNTRY_MIN})`
                : lang === "pl"
                  ? `Kraj jest za krótki (min. ${COUNTRY_MIN})`
                  : `Country is too short (min ${COUNTRY_MIN})`,
        });
      })
      .test("country-max", function (value) {
        const current = (value ?? "").trim().length;
        if (current <= COUNTRY_MAX) return true;
        return this.createError({
          message:
            lang === "ru"
              ? `Слишком длинное название страны (макс. ${COUNTRY_MAX})`
              : lang === "de"
                ? `Land ist zu lang (max. ${COUNTRY_MAX})`
                : lang === "pl"
                  ? `Kraj jest za długi (max ${COUNTRY_MAX})`
                  : `Country is too long (max ${COUNTRY_MAX})`,
        });
      }),

    agreedToPolicy: Yup.boolean()
      .required(dataForm.validationAgreementRequired)
      .oneOf([true], dataForm.validationAgreementOneOf),
  });

  const onSubmit = async (
    values: FormData,
    { setSubmitting, resetForm }: FormikHelpers<FormData>
  ) => {
    setSubmitting(true);

    try {
      const currentPage = window.location.href;

      const response = await axios.post("/api/email", {
        ...values,
        phone: values.phone || "",
        formStartTime, // ✅ фиксированное время
        currentPage,
        lang,
      });

      if (response.status === 200 && response.data?.ok === true) {
        resetForm({});
        setFilled({
          name: false,
          surname: false,
          phone: false,
          email: false,
          country: false,
        });

        // GTM event
        if (typeof window !== "undefined" && (window as any).dataLayer) {
          (window as any).dataLayer.push({
            event: "form_submission_success",
            form_name: "partners_form",
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
                : "We have received your request and will contact you shortly."
        );

        setTimeout(() => setMessagePopup(null), 5000);
      } else {
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
                : "An error occurred while sending the request. Please try again later."
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
                      field.onBlur(e);
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
                viewBox="0 0 24 24"
                fill="#bd8948"
              >
                <path d="M2 4v16h20V4H2zm4 4h4v2H6V8zm0 4h6v2H6v-2zm10 2c-1.1 0-2 .9-2 2h4c0-1.1-.9-2-2-2zm0-2c.83 0 1.5-.67 1.5-1.5S16.83 11 16 11s-1.5.67-1.5 1.5S15.17 14 16 14z" />
              </svg>

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
                      field.onBlur(e);
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

            {/* Country */}
            <div className={styles.inputWrapper}>
              <svg
                className={styles.icon}
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="#bd8948"
              >
                <path d="M4 2v20h2v-7h13.5c.28 0 .5-.22.5-.5V3.5c0-.28-.22-.5-.5-.5H6V2H4z" />
              </svg>

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

              <Field name="country">
                {({ field }: any) => (
                  <input
                    {...field}
                    id={`${uid}-country`}
                    type="text"
                    className={styles.inputField}
                    onBlur={(e) => {
                      field.onBlur(e);
                      handleBlur(e);
                    }}
                  />
                )}
              </Field>

              <ErrorMessage
                name="country"
                component="div"
                className={styles.error}
              />
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
