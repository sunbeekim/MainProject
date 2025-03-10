import { useState } from 'react';
import { useAppSelector } from '../../store/hooks';

interface ICategoryIconProps {
  categorySize?: 'sm' | 'md' | 'lg';
  onCategorySelect?: (categoryId: number, categoryName: string) => void;
}

const CategoryIcon: React.FC<ICategoryIconProps> = ({ onCategorySelect, categorySize = 'md' }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { categories } = useAppSelector((state) => state.category);

  const handleCategoryClick = (categoryId: number, categoryName: string) => {
    setSelectedCategory(categoryName);
    onCategorySelect?.(categoryId, categoryName);
  };

  // 전체 버튼 클릭 핸들러 추가
  const handleAllClick = () => {
    setSelectedCategory(null);
    onCategorySelect?.(0, '전체');
  };

  const getButtonSize = () => {
    switch (categorySize) {
      case 'sm':
        return 'w-10 h-10';
      case 'lg':
        return 'w-16 h-16';
      default:
        return 'w-14 h-14';
    }
  };

  const getTextSize = () => {
    switch (categorySize) {
      case 'sm':
        return 'text-xs';
      case 'lg':
        return 'text-base';
      default:
        return 'text-sm';
    }
  };

  const getCategoryEmoji = (categoryName: string): string => {
    const emojiMap: { [key: string]: string } = {
      '운동🏃‍♂️': '🏃‍♂️',
      '팀스포츠🏆': '🏆',
      '예술🎨': '🎨',
      '음악🎵': '🎵',
      '요리🍽️': '🍽️',
      '자기계발📚': '📚',
      '여행🌍': '🌍',
      '독서📖': '📖',
      '전체🔍': '🔍'
    };
    return emojiMap[categoryName] || '🔥';
  };

  return (
    <div className="w-full dark:bg-gray-800 pt-2">
      <div className="flex gap-3 overflow-x-auto pb-4 px-2 no-scrollbar">
        {/* 전체 버튼 추가 */}
        <div className="flex-shrink-0 flex flex-col items-center gap-2 p-1">
          <button
            onClick={() => handleAllClick()}
            className={`
              ${getButtonSize()}
              flex items-center justify-center
              bg-white
              border-2 rounded-full
              transition-all duration-200 ease-in-out
              ${
                selectedCategory === null
                  ? 'border-primary-light bg-primary-light/5 transform hover:scale-105'
                  : 'border-gray-200 hover:border-primary-light hover:scale-105'
              }
            `}
          >
            <span className="text-xl">{getCategoryEmoji('전체')}</span>
          </button>
          <span className={`${getTextSize()} font-medium text-center`}>
            전체
          </span>
        </div>

        {categories.map((category) => (
          <div key={category.categoryId} className="flex-shrink-0 flex flex-col items-center gap-2 p-1">
            <button
              onClick={() => handleCategoryClick(category.categoryId, category.categoryName)}
              className={`
                ${getButtonSize()}
                flex items-center justify-center
                bg-white
                border-2 rounded-full
                transition-all duration-200 ease-in-out
                ${
                  selectedCategory === category.categoryName
                    ? 'border-primary-light bg-primary-light/5 transform hover:scale-105'
                    : 'border-gray-200 hover:border-primary-light hover:scale-105'
                }
              `}
            >
              <span className="text-xl">{getCategoryEmoji(category.categoryName)}</span>
            </button>
            <span className={`${getTextSize()} font-medium text-center`}>
              {category.categoryName}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryIcon;
