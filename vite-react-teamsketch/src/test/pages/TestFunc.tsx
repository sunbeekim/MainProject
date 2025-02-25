import { useState } from "react";


const TestFunc = () => {

  const [test, setTest] = useState(0);
  const [test2, setTest2] = useState(0);

  const handleTest = () => {
    setTest(test + 1);
  }

  return (
  <div>TestFunc
    <button onClick={handleTest}>test</button>
    {test}
    <button onClick={()=>setTest2(test2+1)}>test2</button>
    {test2}
  </div>
  )
};

export default TestFunc;

