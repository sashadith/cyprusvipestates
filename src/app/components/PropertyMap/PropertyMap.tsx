"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FC } from "react";
import styles from "./PropertyMap.module.scss";

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const customMarkerIcon = new L.Icon({
  iconUrl:
    "https://cdn.sanity.io/files/88gk88s2/production/b505baf3de67bb4a320352ebbb2af98fe2e04537.png",
  iconSize: [62, 95],
  iconAnchor: [20, 100],
  popupAnchor: [0, -41],
});

type SupportedLang = "de" | "en" | "ru" | "pl";

type Props = {
  lat: number;
  lng: number;
  lang?: string;
  showPopup?: boolean;
};

const popupMessages: Record<SupportedLang, string> = {
  de: "Diese Immobilie befindet sich hier.",
  en: "This property is located here.",
  ru: "Здесь находится этот объект.",
  pl: "Tutaj znajduje się ta nieruchomość.",
};

const PropertyMap: FC<Props> = ({
  lat,
  lng,
  lang = "de",
  showPopup = false,
}) => {
  const safeLang: SupportedLang = ["de", "en", "ru", "pl"].includes(lang)
    ? (lang as SupportedLang)
    : "de";

  return (
    <div className={styles.propertyMap}>
      <MapContainer
        center={[lat, lng]}
        zoom={14}
        scrollWheelZoom={true}
        attributionControl={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className={styles.grayscaleTile}
        />

        <Marker position={[lat, lng]} icon={customMarkerIcon}>
          {showPopup && (
            <Popup>
              <b>{popupMessages[safeLang]}</b>
            </Popup>
          )}
        </Marker>
      </MapContainer>
    </div>
  );
};

export default PropertyMap;
