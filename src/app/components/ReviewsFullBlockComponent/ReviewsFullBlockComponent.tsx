import React, { FC } from "react";
import styles from "./ReviewsFullBlockComponent.module.scss";
// import SliderReviews from "../SliderReviews/SliderReviews";
import { ReviewsFullBlock } from "@/types/blog";
import SliderReviewsFull from "../SliderReviewsFull/SliderReviewsFull";

type Props = {
  block: ReviewsFullBlock;
};

const ReviewsFullBlockComponent: FC<Props> = ({ block }) => {
  const { title, reviews } = block;

  return (
    <section id="reviews" className={styles.reviews}>
      <div className="container">
        <h2 className={styles.title}>{title}</h2>
        <SliderReviewsFull reviews={reviews} />
      </div>
    </section>
  );
};

export default ReviewsFullBlockComponent;
