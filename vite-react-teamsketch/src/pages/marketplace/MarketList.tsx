import { testAPI } from '../../services/api/testAPI';
import { useState } from 'react';

//test api 호출 페이지
const MarketList = () => {
  const [testResponse, setTestResponse] = useState<any>(null);
  const [testResponse2, setTestResponse2] = useState<any>(null);
  const [testResponse3, setTestResponse3] = useState<any>(null);
  // eslint가 any를 권장하지 않아서 에러줄 뜸 
  // eslint config에 any를 무시하도록 추가해주면 에러줄 사라짐
  const handleSendtest = async () => {
    const response = await testAPI.getHello();
    console.log(response);
    setTestResponse(response);
  };

  const handleSendtest2 = async () => {
    const response = await testAPI.postEcho({ message: '안녕하세요' });
    console.log(response);
    setTestResponse2(response);
  };

  const handleSendtest3 = async () => {
    const response = await testAPI.getHealth();
    console.log(response);
    setTestResponse3(response);
  };

  return (
    <div>
      <h1>MarketList [test api 호출]</h1>

      <button onClick={handleSendtest}>
        hello endpoint 호출
      </button>
      <button onClick={handleSendtest2}>
        echo endpoint 호출
      </button>
      <button onClick={handleSendtest3}>
        health endpoint 호출
      </button>
      <div>
        {testResponse && (
          <div>
            <h3>Hello Endpoint Response:</h3>
            <pre>{JSON.stringify(testResponse, null, 2)}</pre>
          </div>
        )}
      </div>
      <div>
        {testResponse2 && (
          <div>
            <h3>Echo Endpoint Response:</h3>
            <pre>{JSON.stringify(testResponse2, null, 2)}</pre>
          </div>
        )}
      </div>
      <div>
        {testResponse3 && ( 
          <div>
            <h3>Health Endpoint Response:</h3>
            <pre>{JSON.stringify(testResponse3, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketList;
