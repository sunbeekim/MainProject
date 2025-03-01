import ThemeToggle from '../../components/common/ThemeToggle';
import { Link } from 'react-router-dom';
import ResetPassword from '../account/ResetPassword';


const Setting = () => {
  return (
    <div className="p-4">
      <h1>Setting</h1>
      모드변경 <ThemeToggle />
      <div>
        <button className="m-2  hover:text-primary-dark px-3 py-1 rounded-md bg-[#F3F2FF] dark:bg-[#1C1C1C] text-white">
          <Link to="/servicechat">고객센터 챗봇</Link>
        </button>
      </div>
     
    </div>
  );
};

export default Setting;
