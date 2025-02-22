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

// Создаем кастомный маркер с цветом #aa7f2e
// const customMarkerIcon = new L.DivIcon({
//   html: `
//     <svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41" fill="none">
//       <path d="M12.5 0C5.6 0 0 5.6 0 12.5C0 18.8 5.6 28.2 12.5 40.9C19.4 28.2 25 18.8 25 12.5C25 5.6 19.4 0 12.5 0ZM12.5 17.2C9.6 17.2 7.3 14.9 7.3 12C7.3 9.1 9.6 6.8 12.5 6.8C15.4 6.8 17.7 9.1 17.7 12C17.7 14.9 15.4 17.2 12.5 17.2Z" fill="#aa7f2e"/>
//     </svg>
//   `,
//   className: "", // Отключаем стандартные стили
//   iconSize: [25, 41], // Размер маркера
//   iconAnchor: [12.5, 41], // Точка привязки маркера к координатам
//   popupAnchor: [0, -41], // Точка привязки всплывающего окна
// });

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
        zoom={16}
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
