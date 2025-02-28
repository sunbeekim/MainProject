import { useTestApi } from '../services/api/testAPI';

const TestAPI = () => {
    const { useHello, useEcho, useHealth } = useTestApi();

    const { data: helloData, refetch: refetchHello } = useHello();
    const { data: healthData, refetch: refetchHealth } = useHealth();
    const { mutate: echoMutate, data: echoData } = useEcho();

    const handleSendtest = () => {
        refetchHello();
      };
    
      const handleSendtest2 = () => {
        echoMutate({ message: '안녕하세요' });
      };
    
      const handleSendtest3 = () => {
        refetchHealth();
      };
    
      
    
  return (
    <div>
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
        {helloData && (
          <div>
            <h3>Hello Endpoint Response:</h3>
            <pre>{JSON.stringify(helloData, null, 2)}</pre>
          </div>
        )}
      </div>

      <div>
        {healthData && (
          <div>
            <h3>Health Endpoint Response:</h3>
            <pre>{JSON.stringify(healthData, null, 2)}</pre>
          </div>
        )}
      </div>

      <div>
        {echoData && (
          <div>
            <h3>Echo Endpoint Response:</h3>
            <pre>{JSON.stringify(echoData, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestAPI;