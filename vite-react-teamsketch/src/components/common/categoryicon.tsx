
const categories = [
    { name: "미술", icon:'🎨' },
    { name: "스포츠", icon:'⚽' },
    { name: "음악", icon:'🎤'},
    { name: "미용", icon:'💄' },
    { name: "개발", icon:'🖥️' },
    { name: "디자인", icon:'🪄' },
    { name: "게임", icon:'🎮' },
    { name: "DIY", icon:'🪡' },
    
];

const Category = ( ) => {
    return (
        <div className="p-4">
            <div className="flex gap-4 overflow-x-auto pb-3">
                {categories.map((category, index) => (
                 <button
                   key={index}
                   className="flex flex-col items-center justify-center w-16 h-16 border-2 border-purple-500 text-black-500 rounded-full text-sm "
                    >
                <span className="text-xl">{category.icon}</span>
                
                <span className="absolute bottom-[590px] mt-2">{category.name}</span>
                  </button>
                ))}
            </div>
        </div>
    );

};
   

export default Category;
