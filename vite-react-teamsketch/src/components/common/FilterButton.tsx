import { useState } from 'react';

interface FilterButtonProps {
    onDistanceChange: (distance: number) => void;
}
const FilterButton = ({ onDistanceChange }: FilterButtonProps) => {
    const [open, setOpen] = useState(false);
    const [distance, setDistance] = useState(5); // 초기 거리값

    // 슬라이더 값 변경 처리
    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDistance = Number(e.target.value);
        setDistance(newDistance);
    };

    // 선택 버튼 클릭 시 부모 컴포넌트에 거리 값 전달
    const handleSelectClick = () => {
        setOpen(false);
        onDistanceChange(distance);
    };

    return (
        <div className="relative inline-block">
            {/* 필터 버튼 */}
            <button
                onClick={() => setOpen(!open)}
                className="w-10 h-10 rounded-full text-lg flex items-center justify-center"
            >
                📍
            </button>

            {/* 슬라이더 박스 */}
            {open && (
                <div className="absolute p-4 bg-primary-50 border rounded shadow-lg w-64 right-0 z-10">
                    <div className="mb-2">
                        <label className="block text-sm font-semibold">반경 {distance}km 이내</label>
                    </div>
                    <div className="mb-3">
                        <input
                            type="range"
                            min="1"
                            max="200"
                            value={distance}
                            onChange={handleSliderChange}
                            className="w-full slider"
                        />
                    </div>
                    <div className="mt-2 flex justify-end">
                        <button
                            onClick={handleSelectClick}
                            className="px-3 py-2 bg-primary-400 rounded hover:bg-primary-500 text-sm"
                        >
                            선택
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterButton;