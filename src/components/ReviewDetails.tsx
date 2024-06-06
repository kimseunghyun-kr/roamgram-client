import React from 'react';
import { Review } from '../types/Review';

interface ReviewDetailsProps {
  review: Review;
}

const ReviewDetails: React.FC<ReviewDetailsProps> = ({ review }) => {
  return (
    <div className="p-4 border rounded shadow my-4">
      <p>{review.userDescription}</p>
      <p>Rating: {review.rating}</p>
      {/* Additional review details can be rendered here */}
    </div>
  );
};

export default ReviewDetails;
