import { useState, useRef } from 'react';
import ImageUpload from '../components/features/upload/ImageUpload';
import { fileUpload } from '../services/api/testAPI';
const TestFunc = () => {
  const [test, setTest] = useState(0);
  const [test2, setTest2] = useState(0);
  const testRef = useRef(0);
  const handleTest = () => {
    setTest(test + 1);
  };

  const handleRef = () => {
    testRef.current++;
  };
  return (
    <div>
      TestFunc
      <button onClick={handleTest}>test</button>
      {test}
      <button onClick={() => setTest2(test2 + 1)}>test2</button>
      {test2}
      <button onClick={handleRef}>testRef</button>
      {testRef.current}
      <section>
        <div>
          <h2 className="text-xl font-semibold mb-4">상품 이미지 업로드</h2>
          <ImageUpload onUpload={fileUpload.CloudOCR} className="max-w-md mx-auto" type="prod" />
        </div>
        <br />
        <br />
      </section>
    </div>
  );
};

export default TestFunc;
