import { testAPI } from '../../services/api/testAPI';
import { useState } from 'react';
//test api 호출 페이지
const MarketList = () => {
  const [testResponse, setTestResponse] = useState<any>(null);
  const [testResponse2, setTestResponse2] = useState<any>(null);
  const [testResponse3, setTestResponse3] = useState<any>(null);
  
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
      안녕하소 반갑소 테스트 에이피아이 호출 페이지에 온 것을 환영하오....
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
