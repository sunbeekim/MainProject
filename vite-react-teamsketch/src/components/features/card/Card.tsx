interface CardProps {
  title: string;
  description?: string;
  image?: string;
  onClick?: () => void;
  className?: string;
  price?: number;
  dopamine?: number;
  currentParticipants?: number;
  maxParticipants?: number;
  location?: string;
}

const Card = ({
  title,
  description,
  image,
  onClick,
  className = '',
  price,
  dopamine,
  currentParticipants,
  maxParticipants,
  location
}: CardProps) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white dark:bg-gray-800
        rounded-xl shadow-sm hover:shadow-md
        overflow-hidden
        transition-all duration-300 ease-in-out
        hover:scale-[1.02]
        cursor-pointer
        h-[240px] sm:h-[280px] md:h-[320px] lg:h-[360px]
        border border-gray-100 dark:border-gray-700
        ${className}
      `}
    >
      {image && (
        <div className="relative h-[55%] overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" 
          />
          {dopamine && (
            <div className="absolute top-2 right-2 bg-yellow-400/90 backdrop-blur-sm text-white 
              px-2 py-1 rounded-full text-xs font-medium shadow-sm">
              도파민 {dopamine}
            </div>
          )}
        </div>
      )}
      <div className="p-3 sm:p-4 flex flex-col h-[40%] justify-between">
        <div className="space-y-1 sm:space-y-2">
          <h3 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-100 truncate">
            {title}
          </h3>
          {description && (
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {description}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {price && (
              <span className="font-medium text-primary-dark dark:text-primary-light">
                {price.toLocaleString()}원
              </span>
            )}
            {currentParticipants !== undefined && maxParticipants !== undefined && (
              <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                {currentParticipants}/{maxParticipants}명
              </span>
            )}
          </div>
          {location && (
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <svg 
                className="w-3 h-3 mr-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                />
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                />
              </svg>
              <span className="truncate">{location}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
