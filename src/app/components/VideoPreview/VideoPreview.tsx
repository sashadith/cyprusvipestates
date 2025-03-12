"use client";
import React, { FC, useRef, useState } from "react";
import styles from "./VideoPreview.module.scss";
import YouTube, { YouTubePlayer } from "react-youtube";
import { ImageAlt } from "@/types/project";

type Props = {
  videoId: string;
  videoPreview: ImageAlt;
};

const VideoPreview: FC<Props> = ({ videoId, videoPreview }) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const playerRef = useRef<YouTubePlayer | null>(null);

  const onPlayerReady = (event: { target: YouTubePlayer }) => {
    playerRef.current = event.target;
    setIsPlayerReady(true);
    if (isVideoLoaded) {
      event.target.playVideo();
      setIsVideoPlaying(true);
    }
  };

  const onPlayerStateChange = (event: { data: number }) => {
    console.log("Player state changed:", event.data);
    if (event.data === 0) {
      // Video ended
      setIsVideoPlaying(false);
    } else if (event.data === 1) {
      // Video playing
      setIsVideoPlaying(true);
    } else if (event.data === 2) {
      // Video paused
      setIsVideoPlaying(false);
    }
  };

  const handlePlayPause = () => {
    if (!isVideoLoaded) {
      setIsVideoLoaded(true);
      return;
    }

    if (isPlayerReady && playerRef.current) {
      if (isVideoPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
      setIsVideoPlaying(!isVideoPlaying);
    } else {
      console.log("Player is not ready");
    }
  };

  return (
    <div className={styles.videoPreview}>
      <div className={styles.overlay}></div>
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
            disablekb: 1, // отключает клавиатурное управление (опционально)
          },
        }}
        onReady={onPlayerReady}
        onStateChange={onPlayerStateChange}
        className={styles.videoFrame}
      />
    </div>
  );
};

export default VideoPreview;
