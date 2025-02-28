
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
      <div key={index} className="flex flex-col items-center">
        <button
          className="flex items-center justify-center w-16 h-16 border-2 border-[#ECCEF5] rounded-full text-black-500 text-xl bg-[#f5ecf8] hover:bg-[#F6CED8]"
        >
          {category.icon}
        </button>
        <span className="mt-2 text-center text-sm">{category.name}</span>
      </div>
    ))}
  </div>
</div>

    );

};
   

export default Category;
