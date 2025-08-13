"use client";

import { FC, useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import styles from "./ProjectsMapAll.module.scss";
import "leaflet/dist/leaflet.css";

type Lang = "en" | "de" | "ru" | "pl";

type MarkerItem = {
  _id: string;
  title: string;
  slug: string | undefined;
  location?: { lat?: number; lng?: number };
  city?: string;
  price?: number;
  previewUrl?: string; // ← добавили
  previewAlt?: string; // ← опционально
};

/* ---------- i18n для городов (как было) ---------- */
type CityKey = "Paphos" | "Limassol" | "Larnaca";
const CITY_CANONICAL: Record<string, CityKey> = {
  paphos: "Paphos",
  pafos: "Paphos",
  limassol: "Limassol",
  larnaca: "Larnaca",
  larnaka: "Larnaca",
};
const CITY_I18N: Record<Lang, Record<CityKey, string>> = {
  en: { Paphos: "Paphos", Limassol: "Limassol", Larnaca: "Larnaca" },
  de: { Paphos: "Paphos", Limassol: "Limassol", Larnaca: "Larnaca" },
  ru: { Paphos: "Пафос", Limassol: "Лимассол", Larnaca: "Ларнака" },
  pl: { Paphos: "Pafos", Limassol: "Limassol", Larnaca: "Larnaka" },
};
function translateCity(city: string | undefined, lang: Lang): string {
  if (!city) return "";
  const key = CITY_CANONICAL[city.trim().toLowerCase()];
  return key ? (CITY_I18N[lang]?.[key] ?? city) : city;
}

/* ---------- утилиты ---------- */
const useValidMarkers = (items: MarkerItem[]) =>
  useMemo(
    () =>
      (items || []).filter(
        (m) =>
          m?.location &&
          typeof m.location.lat === "number" &&
          typeof m.location.lng === "number" &&
          !Number.isNaN(m.location.lat) &&
          !Number.isNaN(m.location.lng)
      ),
    [items]
  );

const FitBounds: FC<{ markers: MarkerItem[] }> = ({ markers }) => {
  const map = useMap();
  const valid = useValidMarkers(markers);
  useEffect(() => {
    if (!valid.length) return;
    const bounds = L.latLngBounds(
      valid.map((m) => [m.location!.lat!, m.location!.lng!] as [number, number])
    );
    map.fitBounds(bounds, { padding: [32, 32] });
  }, [valid, map]);
  return null;
};

const customMarkerIcon = new L.Icon({
  iconUrl:
    "https://cdn.sanity.io/files/88gk88s2/production/b505baf3de67bb4a320352ebbb2af98fe2e04537.png",
  iconRetinaUrl:
    "https://cdn.sanity.io/files/88gk88s2/production/b505baf3de67bb4a320352ebbb2af98fe2e04537.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [35, 52],
  iconAnchor: [15, 40],
  popupAnchor: [0, -40],
});

function formatPrice(price: number, lang: Lang): string {
  const currency = "EUR";
  const locales: Record<Lang, string> = {
    en: "en-US",
    de: "de-DE",
    ru: "ru-RU",
    pl: "pl-PL",
  };
  return new Intl.NumberFormat(locales[lang] || "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

function formatCoords(lat: number, lng: number) {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}

function buildMapLinks(lat: number, lng: number) {
  const ll = `${lat},${lng}`;
  return {
    googleView: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ll)}`,
    googleRoute: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ll)}&travelmode=driving`,
    appleRoute: `https://maps.apple.com/?daddr=${encodeURIComponent(ll)}&dirflg=d`,
    osmView: `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`,
  };
}

function t(
  label: "coords" | "copy" | "copied" | "open" | "route" | "osm",
  lang: Lang
) {
  const dict: Record<Lang, any> = {
    en: {
      coords: "Coordinates",
      copy: "Copy",
      copied: "Copied!",
      open: "Open in Google Maps",
      route: "Route (Google/Apple)",
      osm: "Open in OSM",
    },
    de: {
      coords: "Koordinaten",
      copy: "Kopieren",
      copied: "Kopiert!",
      open: "In Google Maps öffnen",
      route: "Route (Google/Apple)",
      osm: "In OSM öffnen",
    },
    ru: {
      coords: "Координаты",
      copy: "Скопировать",
      copied: "Скопировано!",
      open: "Открыть в Google Картах",
      route: "Маршрут (Google/Apple)",
      osm: "Открыть в OSM",
    },
    pl: {
      coords: "Współrzędne",
      copy: "Kopiuj",
      copied: "Skopiowano!",
      open: "Otwórz w Google Maps",
      route: "Trasa (Google/Apple)",
      osm: "Otwórz w OSM",
    },
  };
  return dict[lang][label];
}

// мини-хелпер для превью: делаем лёгкий thumb с CDN Sanity
function thumb(url?: string, w = 420, h = 240) {
  if (!url) return "";
  if (url.includes("cdn.sanity.io")) {
    const sep = url.includes("?") ? "&" : "?";
    return `${url}${sep}w=${w}&h=${h}&fit=crop&auto=format`;
  }
  return url;
}

type Props = {
  lang: Lang | string;
  markers: MarkerItem[];
};

const ProjectsMapAll: FC<Props> = ({ lang, markers }) => {
  const valid = useValidMarkers(markers);
  const center: [number, number] = [35.1264, 33.4299];
  const LANG = (lang as Lang) || "en";
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (id: string, lat: number, lng: number) => {
    try {
      await navigator.clipboard.writeText(formatCoords(lat, lng));
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1200);
    } catch {}
  };

  return (
    <div className={styles.mapWrap}>
      <MapContainer
        center={center}
        zoom={8}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className={styles.grayscaleTile}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {valid.map((m) => {
          const href = m.slug
            ? LANG === "de"
              ? `/projects/${m.slug}`
              : `/${LANG}/projects/${m.slug}`
            : "#";

          const cityLabel = translateCity(m.city, LANG);
          const lat = m.location!.lat!;
          const lng = m.location!.lng!;
          const coordsText = formatCoords(lat, lng);
          const links = buildMapLinks(lat, lng);
          const bg = thumb(m.previewUrl);

          return (
            <Marker key={m._id} position={[lat, lng]} icon={customMarkerIcon}>
              <Popup className={styles.projectPopup} maxWidth={360}>
                <div
                  className={styles.popupCard}
                  style={{
                    backgroundImage: bg
                      ? `url(${bg})`
                      : "linear-gradient(135deg,#111,#111)",
                  }}
                >
                  <div className={styles.popupOverlay}>
                    <div
                      style={{ fontSize: "20px" }}
                      className={styles.popupTitle}
                    >
                      {m.title}
                    </div>
                    <div className={styles.popupMeta}>
                      {cityLabel && (
                        <span style={{ fontSize: "16px" }}>{cityLabel}</span>
                      )}
                      {typeof m.price === "number" && m.price > 0 && (
                        <span> · {formatPrice(m.price, LANG)}</span>
                      )}
                    </div>

                    <div className={styles.popupActions}>
                      <a
                        href={links.googleView}
                        style={{ color: "#fff" }}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t("open", LANG)}
                      </a>
                      <a
                        href={links.googleRoute}
                        style={{ color: "#fff" }}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t("route", LANG)}
                      </a>
                      <a
                        href={links.osmView}
                        style={{ color: "#fff" }}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t("osm", LANG)}
                      </a>
                      <button onClick={() => handleCopy(m._id, lat, lng)}>
                        {copiedId === m._id
                          ? t("copied", LANG)
                          : t("copy", LANG)}
                      </button>
                    </div>

                    {m.slug && (
                      <Link
                        href={href}
                        target="_blank"
                        className={styles.projectLink}
                        style={{ fontSize: "20px", color: "#fff" }}
                      >
                        {LANG === "de"
                          ? "Projekt öffnen"
                          : LANG === "en"
                            ? "Open project"
                            : LANG === "ru"
                              ? "Открыть проект"
                              : LANG === "pl"
                                ? "Otwórz projekt"
                                : "Open project"}
                      </Link>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        <FitBounds markers={valid} />
      </MapContainer>
    </div>
  );
};

export default ProjectsMapAll;
