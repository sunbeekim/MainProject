import ThemeToggle from '../../components/common/ThemeToggle';
import { Link } from 'react-router-dom';

const Setting = () => {
  return (
    <div>
      <h1>Setting</h1>
      모드변경 <ThemeToggle />
      <div>        
        <button>
          <Link to="/servicechat">
            고객센터 챗봇
          </Link>
        </button>
      </div>
    </div>
  );
};

export default Setting;


