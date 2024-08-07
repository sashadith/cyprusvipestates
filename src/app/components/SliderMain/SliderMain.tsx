"use client";
import styles from "./SliderMain.module.scss";
import React, { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";

const SliderMain = ({ children }: any) => {
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      let maxHeight = 0;
      entries.forEach((entry) => {
        if (entry.target instanceof HTMLElement) {
          const slideHeight = entry.target.offsetHeight;
          if (slideHeight > maxHeight) {
            maxHeight = slideHeight;
          }
        }
      });

      slideRefs.current.forEach((slide) => {
        if (slide) {
          slide.style.height = `${maxHeight}px`;
        }
      });
    });

    slideRefs.current.forEach((slide) => {
      if (slide) {
        observer.observe(slide);
      }
    });

    return () => {
      slideRefs.current.forEach((slide) => {
        if (slide) {
          observer.unobserve(slide);
        }
      });
    };
  }, [children]);

  return (
    <div className={styles.sliderMain}>
      <div className={styles.sliderSlides}>
        <Swiper
          modules={[Navigation, Autoplay]}
          // spaceBetween={15}
          autoplay={{
            delay: 4000,
            disableOnInteraction: true,
          }}
          slidesPerView={1}
          navigation={{
            nextEl: `.swiper-main-next`,
            prevEl: `.swiper-main-prev`,
          }}
          pagination={{
            clickable: true,
            el: `.swiper-pagination`,
          }}
          // breakpoints={{
          //   640: { spaceBetween: 20 },
          //   768: { spaceBetween: 30 },
          //   980: { spaceBetween: 30 },
          //   1024: { spaceBetween: 30 },
          // }}
        >
          {children.map((child: any, index: number) => (
            <SwiperSlide key={index}>
              <div
                ref={(el) => {
                  slideRefs.current[index] = el;
                }}
              >
                {child}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className={styles.sliderButtons}>
        <div className={styles.navigation}>
          <button
            className={`swiper-main-prev ${styles.swiperMainPrev} ${styles.swiperButton}`}
          >
            <FaArrowLeftLong
              aria-label="Previous slide"
              fontSize="1.8em"
              className={`${styles.arrow} ${styles.arrowLeft}`}
            />
          </button>
          <button
            className={`swiper-main-next ${styles.swiperMainNext} ${styles.swiperButton}`}
          >
            <FaArrowRightLong
              aria-label="Next slide"
              fontSize="1.8em"
              className={`${styles.arrow} ${styles.arrowRight}`}
            />
          </button>
        </div>
        <div className={styles.pagination}>
          <div className={`swiper-pagination`}>
            <span className="swiper-pagination-bullet"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SliderMain;
