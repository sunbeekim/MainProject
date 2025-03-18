import React from 'react';
import ListItem from './ListItem';

interface IListItemData {
  nickname: string;
  title: string;
  description: string;
  points: number;
}

const IList: React.FC = () => {
  const data: IListItemData[] = [
    {
      nickname: '곰탱이',
      title: '당신이 필요해요!',
      description: '같이 아침에 달리기 할 사람 찾아요!',
      points: 300
    },
    {
      nickname: '곰탱이',
      title: '제가 필요하신가요?',
      description: '축구/야구 잘해요.',
      points: 100
    },
    {
      nickname: '곰탱이',
      title: '당신이 필요해요!',
      description: '베드민턴 좀 치는 사람?',
      points: 200
    },
    {
      nickname: '곰탱이',
      title: '당신이 필요해요!',
      description: '근처 공원에서 강아지랑 산책하실 분!',
      points: 300
    },
    {
      nickname: '곰탱이',
      title: '당신이 필요해요!',
      description: '근처 공원에서 강아지랑 산책하실 분!',
      points: 300
    }
  ];
  const imageUrl = 'https://picsum.photos/600/400';

  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-1 gap-4 ">
        {data.map((item, index) => (
          <ListItem
            key={index}
            nickname={item.nickname}
            title={item.title}
            description={item.description}
            points={item.points}
            imageUrl={imageUrl}
          />
        ))}
      </div>
    </div>
  );
};
export default IList;