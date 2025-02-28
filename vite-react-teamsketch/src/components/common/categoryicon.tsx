import { useState } from 'react';

// 🎨 취미(Categories) 대분류 & 하위 항목

// 1️⃣ 예술 & 공예 (Arts & Crafts)
// 🎨 미술 (Painting & Drawing)
// 수채화 그리기
// 디지털 아트
// 🛠️ 공예 (Handicrafts)
// 목공예
// 도자기 만들기
// 2️⃣ 음악 & 악기 (Music & Instruments)
// 🎸 악기 연주 (Playing Instruments)
// 기타 연주
// 피아노 연주
// 🎤 노래 & 작곡 (Singing & Composing)
// 보컬 트레이닝
// 작곡 & 편곡
// 3️⃣ 스포츠 & 피트니스 (Sports & Fitness)
// ⚽ 구기 스포츠 (Ball Sports)
// 축구
// 농구
// 🏋️‍♂️ 피트니스 & 운동 (Fitness & Exercise)
// 요가
// 헬스 & 웨이트 트레이닝
// 4️⃣ 게임 & e스포츠 (Games & eSports)
// 🎮 비디오 게임 (Video Games)
// 콘솔 게임 (PS, Xbox)
// PC 게임 (FPS, RPG)
// ♟️ 보드 & 테이블 게임 (Board & Table Games)
// 체스
// 카드 게임 (포커, 블랙잭)
// 5️⃣ 여행 & 탐험 (Travel & Exploration)
// 🏕️ 캠핑 & 등산 (Camping & Hiking)
// 백패킹
// 국립공원 트레킹
// ✈️ 해외여행 (International Travel)
// 배낭여행
// 크루즈 여행
// 6️⃣ 요리 & 베이킹 (Cooking & Baking)
// 🍳 요리 (Cooking)
// 한식 요리
// 이탈리안 요리
// 🎂 베이킹 (Baking)
// 케이크 만들기
// 쿠키 & 머핀 만들기
// 7️⃣ 독서 & 글쓰기 (Reading & Writing)
// 📖 독서 (Reading)
// 소설 읽기
// 자기계발서 읽기
// ✍️ 글쓰기 (Writing)
// 소설 창작
// 블로그 글쓰기
// 8️⃣ 수집 & 컬렉션 (Collecting)
// 🪙 화폐 & 우표 수집 (Coin & Stamp Collecting)
// 희귀 동전 수집
// 기념 우표 수집
// 🖼️ 피규어 & 굿즈 수집 (Figures & Merchandise)
// 애니메이션 피규어 수집
// 영화 굿즈 수집
// 9️⃣ DIY & 전자기기 (DIY & Tech)
// 🔨 DIY 제작 (DIY Crafting)
// 가구 만들기
// 인테리어 소품 제작
// 🔧 전자기기 제작 & 수리 (Electronics & Repair)
// 아두이노 프로젝트
// 드론 조립
// 🔟 과학 & 자연 탐구 (Science & Nature Exploration)
// 🔬 과학 실험 (Science Experiments)
// 화학 실험
// 천체 관측
// 🌿 식물 & 가드닝 (Plants & Gardening)
// 실내 식물 키우기
// 채소 재배

// 카테고리 타입 정의
interface ICategory {
  name: string;
  icon: string;
}

// 카테고리 데이터 구조화
const categories: ICategory[] = [
  { name: "예술", icon: "🎨" },
  { name: "음악", icon: "🎵" },
  { name: "스포츠", icon: "⚽" },
  { name: "게임", icon: "🎮" },
  { name: "여행", icon: "✈️" },
  { name: "요리", icon: "🍳" },
  { name: "독서", icon: "📚" },
  { name: "수집", icon: "🖼️" },
  { name: "DIY", icon: "🔨" },
  { name: "과학", icon: "🔬" }
];

interface ICategoryIconProps {
  onCategorySelect?: (category: string) => void;
}

const CategoryIcon: React.FC<ICategoryIconProps> = ({ onCategorySelect }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    onCategorySelect?.(category);
  };

  return (
    <div className="w-full overflow-hidden">
      {selectedCategory && (
        <div className="text-center mb-4 text-lg font-semibold text-primary-light">
          선택된 카테고리: {selectedCategory}
        </div>
      )}

      {/* 메인 카테고리 - 가로 스크롤 적용 */}
      <div className="flex gap-4 overflow-x-auto pb-4 px-2 no-scrollbar">
        {categories.map((category, index) => (
          <div key={index} className="flex-shrink-0">
            <button
              onClick={() => handleCategoryClick(category.name)}
              className={`
                w-20 h-20
                flex flex-col items-center justify-center
                border-2 rounded-full
                transition-all duration-200 ease-in-out
                ${
                  selectedCategory === category.name
                    ? 'border-primary-light bg-primary-light/10 scale-110'
                    : 'border-gray-300 hover:border-primary-light hover:scale-105'
                }
              `}
            >
              <span className="text-2xl">{category.icon}</span>
              <span className="text-xs font-medium mt-1">
                {category.name}
              </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryIcon;
