"use client";

import React, { FC, useState, useEffect } from "react";
import ReactModal from "react-modal";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Controller } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import styles from "./ProjectSlider.module.scss";
import modalStyles from "./Modal.module.scss"; // Стили для модального окна

import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import PropertySlideThumb from "../PropertySlideThumb/PropertySlideThumb";
import { ImageAlt } from "@/types/property";
import Image from "next/image";
import { urlFor } from "@/sanity/sanity.client";

// Выполняем установку appElement после монтирования компонента
// Если элемент с id "__next" не найден, используем document.body
const setModalAppElement = () => {
  if (typeof document !== "undefined") {
    const appElement = document.querySelector("#__next") || document.body;
    ReactModal.setAppElement(appElement as HTMLElement);
  }
};

type Props = {
  images: ImageAlt[];
};

const ProjectSlider: FC<Props> = ({ images }) => {
  // Состояние для открытия/закрытия модального окна и активного индекса слайда
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Ссылки на экземпляры Swiper для синхронизации
  const [mainSwiper, setMainSwiper] = useState<any>(null);
  const [modalSwiper, setModalSwiper] = useState<any>(null);

  // Выполняем установку appElement после монтирования компонента
  useEffect(() => {
    setModalAppElement();
  }, []);

  // Функция открытия модального окна, при которой сохраняется индекс выбранного слайда
  const openModal = (index: number) => {
    setActiveIndex(index);
    setIsModalOpen(true);
  };

  // Закрытие модального окна
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Главный слайдер с миниатюрами */}
      <Swiper
        onSwiper={setMainSwiper}
        // Синхронизация с модальным слайдером
        controller={{ control: modalSwiper }}
        navigation={{
          nextEl: ".next-button",
          prevEl: ".prev-button",
        }}
        slidesPerView={4}
        spaceBetween={20}
        // pagination={{ clickable: true }}
        modules={[Navigation, Controller]}
        breakpoints={{
          0: {
            slidesPerView: 1.2,
            spaceBetween: 10,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 10,
          },
          980: {
            slidesPerView: 6,
            spaceBetween: 10,
          },
        }}
        className={styles.slider}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} onClick={() => openModal(index)}>
            {/* Оборачиваем слайд в <div> с cursor:pointer */}
            <div style={{ cursor: "pointer" }}>
              <PropertySlideThumb image={image} />
            </div>
          </SwiperSlide>
        ))}

        <div className={styles.navButtons}>
          <button className="prev-button">
            <IoIosArrowBack fontSize="3.5rem" color="#aa7f2e" />
          </button>
          <button className="next-button">
            <IoIosArrowForward fontSize="3.5rem" color="#aa7f2e" />
          </button>
        </div>
      </Swiper>

      {/* Модальное окно с полноэкранным слайдером */}
      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="View images"
        className={modalStyles.modalContent}
        overlayClassName={modalStyles.modalOverlay}
      >
        {/* Кнопка закрытия модального окна */}
        <button className={modalStyles.closeButton} onClick={closeModal}>
          &times;
        </button>

        <Swiper
          initialSlide={activeIndex}
          onSwiper={setModalSwiper}
          // Синхронизация с главным слайдером
          controller={{ control: mainSwiper }}
          spaceBetween={10}
          navigation={{
            nextEl: ".modal-next-button",
            prevEl: ".modal-prev-button",
          }}
          pagination={{ clickable: true }}
          modules={[Navigation, Pagination, Controller]}
          className={modalStyles.fullscreenSlider}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <Image
                src={urlFor(image).url()}
                alt={image.alt || "Cyprus VIP Estate Project"}
                className={modalStyles.fullscreenImage}
                fill={true}
                // width={1080}
                // height={720}
              />
            </SwiperSlide>
          ))}

          <div className={modalStyles.modalNavButtons}>
            <button className="modal-prev-button">
              <IoIosArrowBack fontSize="3.5rem" color="#aa7f2e" />
            </button>
            <button className="modal-next-button">
              <IoIosArrowForward fontSize="3.5rem" color="#aa7f2e" />
            </button>
          </div>
        </Swiper>
      </ReactModal>
    </>
  );
};

export default ProjectSlider;
