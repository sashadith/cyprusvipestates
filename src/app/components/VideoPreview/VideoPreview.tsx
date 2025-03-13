"use client";
import React, { FC, useRef, useState } from "react";
import styles from "./VideoPreview.module.scss";
import YouTube, { YouTubePlayer } from "react-youtube";
import { ImageAlt } from "@/types/project";
import AnimatedPreview from "../AnimatedPreview/AnimatedPreview";
import { urlFor } from "@/sanity/sanity.client";

type Props = {
  videoId: string;
  videoPreview: ImageAlt;
};

const VideoPreview: FC<Props> = ({ videoId, videoPreview }) => {
  const [showPoster, setShowPoster] = useState(true); // статичная заставка
  const [animateOut, setAnimateOut] = useState(false); // флаг запуска анимации
  const playerRef = useRef<YouTubePlayer | null>(null);

  const onPlayerReady = (event: { target: YouTubePlayer }) => {
    playerRef.current = event.target;
    // Запускаем видео (автовоспроизведение)
    event.target.playVideo();
  };

  const onPlayerStateChange = (event: { data: number }) => {
    if (event.data === 1 && !animateOut) {
      // Видео начинает играть – запускаем анимацию для скрытия заставки
      setAnimateOut(true);
    } else if (event.data === 0) {
      // Видео закончилось – возвращаем статичную заставку
      setShowPoster(true);
    }
  };

  const handleAnimationComplete = () => {
    // По окончании анимации убираем AnimatedPreview и скрываем заставку, чтобы видео было видно
    setAnimateOut(false);
    setShowPoster(false);
  };

  return (
    <div className={styles.videoPreview}>
      {/* Показываем статичный постер, если он должен отображаться и анимация не активна */}
      {showPoster && !animateOut && (
        <div className={styles.previewWrapper}>
          <img
            alt="Video preview"
            src={urlFor(videoPreview).url()}
            className={styles.imagePoster}
          />
        </div>
      )}
      {/* Если анимация запущена – показываем AnimatedPreview */}
      {animateOut && (
        <AnimatedPreview
          imageUrl={urlFor(videoPreview).url()}
          onAnimationComplete={handleAnimationComplete}
        />
      )}
      <YouTube
        videoId={videoId}
        opts={{
          width: "100%",
          height: "100%",
          playerVars: {
            autoplay: 1,
            mute: 1,
            controls: 0,
            modestbranding: 1,
            rel: 0,
            disablekb: 1,
            // Чтобы видео завершилось (и сработало событие ended), можно убрать loop
            // loop: 1,
            playlist: videoId,
            playsinline: 1,
            showinfo: 0,
            vq: "hd720",
            fs: 0,
          },
        }}
        onReady={onPlayerReady}
        onStateChange={onPlayerStateChange}
        className={styles.videoFrame}
      />
      <div className={styles.overlay}></div>
    </div>
  );
};

export default VideoPreview;
