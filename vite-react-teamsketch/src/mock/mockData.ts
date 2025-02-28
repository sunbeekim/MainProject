export const mockMessages = [
  {
    role: 'assistant',
    content: '안녕하세요! AI 고객센터입니다. 무엇을 도와드릴까요?'
  },
  {
    role: 'user',
    content: '클라우드 서비스 요금제에 대해 알고 싶어요.'
  },
  {
    role: 'assistant',
    content:
      '네이버 클라우드의 요금제는 크게 세 가지로 나뉩니다: Basic, Standard, Premium. 어떤 부분이 궁금하신가요?'
  }
];

export const mockUsers = [
  {
    id: 1,
    email: 'test@test.com',
    name: '테스트 유저',
    role: 'user'
  }
];

export const mockAuthResponse = {
  token: 'mock-jwt-token',
  user: mockUsers[0]
};
