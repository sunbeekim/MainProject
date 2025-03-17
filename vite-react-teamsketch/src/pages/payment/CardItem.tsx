type CardItemProps = {
    type: string;
    onDelete: () => void;
};

const CardItem = ({ type, onDelete }: CardItemProps) => (
    <div className="space-y-4">
        <div
            className="flex items-center gap-4 bg-white p-3 rounded-lg border-2 border-primary-light hover:bg-secondary-light cursor-pointer"
        >

            <div className="w-20 h-12 bg-gray-300 rounded-md flex items-center justify-center">
                카드
            </div>
            <span className="text-lg font-semibold">체크카드</span>
            <button onClick={onDelete} className="ml-auto rounded">삭제</button>
        </div>

        <div className="flex items-center justify-between bg-white p-3 rounded-lg border-2 border-primary-light hover:bg-secondary-light cursor-pointer">
            <div className="flex items-center gap-4">
                <div className="w-20 h-12 bg-gray-300 rounded-md flex items-center justify-center">
                    카드
                </div>
                <span className="text-lg font-semibold">{type}</span>
            </div>
            <button onClick={onDelete} className="ml-auto rounded">삭제</button>
        </div>
    </div>
);

export default CardItem;