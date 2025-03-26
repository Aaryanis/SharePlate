import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const RatingStars = ({ rating, size = 'sm', showText = false }) => {
  const numRating = Number(rating) || 0;
  
  // Get the correct size class
  let sizeClass = 'fs-6'; // default (sm)
  if (size === 'lg') {
    sizeClass = 'fs-4';
  } else if (size === 'md') {
    sizeClass = 'fs-5';
  } else if (size === 'xl') {
    sizeClass = 'fs-3';
  }
  
  const stars = [];
  
  // Generate stars
  for (let i = 1; i <= 5; i++) {
    if (i <= numRating) {
      // Full star
      stars.push(
        <FaStar key={i} className={`text-warning ${sizeClass}`} />
      );
    } else if (i - 0.5 <= numRating) {
      // Half star
      stars.push(
        <FaStarHalfAlt key={i} className={`text-warning ${sizeClass}`} />
      );
    } else {
      // Empty star
      stars.push(
        <FaRegStar key={i} className={`text-warning ${sizeClass}`} />
      );
    }
  }
  
  return (
    <>
      <div className="d-inline-flex align-items-center">
        {stars}
        {showText && (
          <span className="ms-2 text-muted">
            {numRating.toFixed(1)}
          </span>
        )}
      </div>
    </>
  );
};

export default RatingStars;