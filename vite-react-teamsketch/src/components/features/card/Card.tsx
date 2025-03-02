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
        rounded-lg shadow-sm overflow-hidden
        transition-transform hover:scale-105
        cursor-pointer
        h-[140px] sm:h-[160px] lg:h-[200px]
        ${className}
      `}
    >
      {image && (
        <div className="relative h-[60px] sm:h-[80px] lg:h-[100px]">
          <img src={image} alt={title} className="w-full h-full object-cover" />
          {dopamine && (
            <div className="absolute top-1 right-1 bg-yellow-400 text-white px-1 py-0.5 rounded text-[10px] sm:text-xs">
              도파민 {dopamine}
            </div>
          )}
        </div>
      )}
      <div className="p-1 sm:p-2">
        <h3 className="text-xs sm:text-sm font-semibold mb-0.5 sm:mb-1 truncate">{title}</h3>
        {description && (
          <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-300 mb-0.5 sm:mb-1 line-clamp-2">
            {description}
          </p>
        )}
        <div className="flex justify-between items-center text-[10px] sm:text-xs text-gray-500">
          {price && <span>{price.toLocaleString()}원</span>}
          {currentParticipants && maxParticipants && (
            <span>{currentParticipants}/{maxParticipants}명</span>
          )}
        </div>
        {location && (
          <div className="mt-0.5 text-[10px] sm:text-xs text-gray-500 truncate">
            <span>{location}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
