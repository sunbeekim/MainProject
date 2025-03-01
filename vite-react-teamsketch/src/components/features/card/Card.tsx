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
        rounded-lg shadow-md overflow-hidden
        transition-transform hover:scale-105
        cursor-pointer
        ${className}
      `}
    >
      {image && (
        <div className="relative h-40">
          <img src={image} alt={title} className="w-full h-full object-cover" />
          {dopamine && (
            <div className="absolute top-2 right-2 bg-yellow-400 text-white px-2 py-1 rounded-full text-sm">
              도파민 {dopamine}
            </div>
          )}
        </div>
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">{description}</p>
        )}
        <div className="flex justify-between items-center text-sm text-gray-500">
          {price && <span>{price.toLocaleString()}원</span>}
          {currentParticipants && maxParticipants && (
            <span>{currentParticipants}/{maxParticipants}명</span>
          )}
        </div>
        {location && (
          <div className="mt-2 text-sm text-gray-500">
            <span>{location}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
