interface CardProps {
  title: string;
  description?: string;
  image?: string;
  onClick?: () => void;
  className?: string;
}

const Card = ({ title, description, image, onClick, className = '' }: CardProps) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-background-light dark:bg-background-dark
        rounded-lg shadow-md overflow-hidden
        transition-transform hover:scale-105
        cursor-pointer
        ${className}
      `}
    >
      {image && <img src={image} alt={title} className="w-full h-48 object-cover" />}
      <div className="p-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{description}</p>
        )}
      </div>
    </div>
  );
};

export default Card;
