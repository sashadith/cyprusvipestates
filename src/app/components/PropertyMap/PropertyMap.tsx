"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FC } from "react";
import styles from "./PropertyMap.module.scss";

// Настройка стандартных иконок Leaflet
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
    "https://cdn.sanity.io/files/88gk88s2/production/b505baf3de67bb4a320352ebbb2af98fe2e04537.png", // замените на URL вашего изображения
  iconSize: [62, 95], // размер изображения
  iconAnchor: [20, 100], // точка привязки (середина нижней части)
  popupAnchor: [0, -41], // положение всплывающего окна относительно маркера
});

type Props = {
  lat: number;
  lng: number;
};

const PropertyMap: FC<Props> = ({ lat, lng }) => {
  return (
    <div className={styles.propertyMap}>
      <MapContainer
        center={[lat, lng]}
        zoom={14}
        scrollWheelZoom={true}
        attributionControl={false}
        style={{ height: "100%", width: "100%" }}
      >
        {/* Черно-белая тема для карты */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className={styles.grayscaleTile}
        />

        {/* Маркер с кастомным цветом */}
        <Marker position={[lat, lng]} icon={customMarkerIcon}>
          <Popup>
            <b>Our office is here!</b>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default PropertyMap;
