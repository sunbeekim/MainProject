import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import LoginLayout from "../../components/layout/LoginLayout";
import TextInput from "../../components/forms/input/TextInput";

const VerficationCode = () => {
    const [code, setCode] = useState(['','','','']);
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newCode = [...code];
        newCode[index] = e.target.value.slice(0, 1); 
        setCode(newCode);

        if (e.target.value && index < 3) {
            document.getElementById(`code-input-${index + 1}`)?.focus();
          }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const enteredCode = code.join('');
        if (enteredCode.length !== 4) {
          alert('인증코드는 4자리여야 합니다.');
          return;
        }
        // 여기에 인증 API 연동을 추가
        alert('인증이 완료되었습니다.');
        navigate('/reset-password'); // 비밀번호 재설정 페이지로 이동
      };
      return (
    <LoginLayout
      title={<h1 className="text-2xl font-bold text-center">인증코드를 입력하세요</h1>}
          >
              
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-gray-500 text-center">
          4자리 코드가 (이메일 또는 전화번호)으로 전송되었습니다.
        </p>

        <div className="flex justify-center space-x-2">
          {code.map((digit, index) => (
            <TextInput
              key={index}
              id={`code-input-${index}`}
              name={`code-${index}`}
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(e, index)}
              placeholder="0"
              className="w-12 text-center"
            />
          ))}
        </div>
        <div className="flex flex-col items-center space-y-4">
        <span
          className="text-center text-sm mt-4 w-full underline cursor-pointer hover:text-[#9FB29E] text-[#F9B0BA]"
        >
          인증코드 재전송
        </span>
오
          <Button variant="primary" className="w-full">
            다음
          </Button>
        </div>
      </form>
    </LoginLayout>
  );
};
export default VerficationCode;