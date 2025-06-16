
import React, { useState } from 'react';

interface RecommendationCardDescriptionProps {
  description?: string;
}

const RecommendationCardDescription = ({ description }: RecommendationCardDescriptionProps) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  if (!description) return null;

  // Truncate description if it's longer than 100 characters
  const shouldTruncate = description.length > 100;
  const displayDescription = shouldTruncate && !showFullDescription 
    ? description.substring(0, 100) + '...'
    : description;

  return (
    <div className="mb-2">
      <p className="text-xs text-gray-600 leading-relaxed">
        {displayDescription}
      </p>
      {shouldTruncate && (
        <button
          onClick={() => setShowFullDescription(!showFullDescription)}
          className="text-xs text-blue-600 hover:text-blue-800 mt-1 font-medium"
        >
          {showFullDescription ? 'Show less' : 'More...'}
        </button>
      )}
    </div>
  );
};

export default RecommendationCardDescription;
